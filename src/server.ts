import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { parseMermaid } from './parser.js';
import { VsdxGenerator } from './vsdx.js';
import fs from 'fs';
import path from 'path';

const server = new Server(
  {
    name: "mermaid2visio-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "convert_mermaid_to_vsdx",
        description: "Converts a Mermaid diagram (source code or file path) into a Microsoft Visio .vsdx file. Returns the absolute path to the generated file.",
        inputSchema: {
          type: "object",
          properties: {
            source: {
              type: "string",
              description: "The Mermaid diagram definition code OR a path to a .mmd/.md file.",
            },
            outputPath: {
              type: "string",
              description: "Optional absolute path for the output .vsdx file. Defaults to a temp file.",
            },
          },
          required: ["source"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "convert_mermaid_to_vsdx") {
    try {
      // Validate input
      const args = request.params.arguments as any;
      if (!args || !args.source) {
        throw new Error("Missing 'source' argument");
      }

      let mermaidCode = args.source;
      const cwd = process.cwd();

      // Check if source is a file
      if (fs.existsSync(args.source)) {
          const content = fs.readFileSync(args.source, 'utf-8');
          if (args.source.endsWith('.md') || content.includes('```mermaid')) {
              const match = content.match(/```mermaid([\s\S]*?)```/);
              if (match) mermaidCode = match[1].trim();
              else mermaidCode = content; // Fallback
          } else {
              mermaidCode = content;
          }
      }

      // Output Path
      let outFile = args.outputPath;
      if (!outFile) {
          const tmpDir = path.join(cwd, 'output');
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          outFile = path.join(tmpDir, `diagram_${timestamp}.vsdx`);
      }

      // Execute Conversion
      const graph = await parseMermaid(mermaidCode);
      const generator = new VsdxGenerator();
      const buffer = await generator.generate(graph);
      
      fs.writeFileSync(outFile, buffer);

      return {
        content: [
          {
            type: "text",
            text: `Successfully generated Visio diagram at: ${outFile}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error generating diagram: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch(console.error);
