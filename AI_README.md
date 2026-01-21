# AI Integration Guide

This project is now "AI-Ready". You can use it in two ways:

## 1. The "Skill" (MCP Server)
This project implements the **Model Context Protocol**. If you use **Claude Desktop** or an MCP-compatible agent, you can register this tool to allow the AI to generate Visio files directly on your machine.

**Configuration (claude_desktop_config.json):**
```json
{
  "mcpServers": {
    "mermaid2visio": {
      "command": "node",
      "args": [
        "C:/code/mermaid2visio/dist/server.js"
      ]
    }
  }
}
```

Once registered, you can simply ask the AI:
> "Take this architecture description, generate a Mermaid diagram, and save it as a Visio file."

## 2. The "Training Manual" (Prompting)
If you are pasting code into ChatGPT or Gemini, give it the context from `AI_INSTRUCTIONS.md`. 

**Example Prompt:**
> "I need a diagram for a Visio export. Please follow the rules in this system prompt: [Paste AI_INSTRUCTIONS.md content]. Here is the requirement..."

This ensures the AI uses `subgraph` for containers, `text-align` styles, and orthogonal routing compatible with this tool.
