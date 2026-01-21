import fs from 'fs';
import path from 'path';
import { parseMermaid } from './parser.js';
import { VsdxGenerator } from './vsdx.js';

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log("Usage: node dist/index.js <input.mmd> [output.vsdx]");
        process.exit(1);
    }

    const inputFile = args[0];
    const outputFile = args[1] || inputFile.replace(/\.mmd$/i, '') + '.vsdx';

    if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`);
        process.exit(1);
    }

    let definition = fs.readFileSync(inputFile, 'utf-8');

    // Markdown Support: Extract mermaid block
    if (inputFile.endsWith('.md') || definition.includes('```mermaid')) {
        console.log("Markdown detected. Extracting Mermaid code...");
        const match = definition.match(/```mermaid([\s\S]*?)```/);
        if (match && match[1]) {
            definition = match[1].trim();
            console.log("Mermaid block extracted.");
        } else {
            console.error("Error: No '```mermaid' code block found in the Markdown file.");
            process.exit(1);
        }
    }

    console.log("Parsing Mermaid...");
    try {
        const graph = await parseMermaid(definition);
        console.log(`Found ${graph.nodes.length} nodes, ${graph.edges.length} edges, ${graph.clusters?.length || 0} clusters, and ${graph.labels?.length || 0} labels.`);

        console.log("Generating VSDX...");
        const generator = new VsdxGenerator();
        const buffer = await generator.generate(graph);

        fs.writeFileSync(outputFile, buffer);
        console.log(`Success! Wrote to ${outputFile}`);

    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

main();
