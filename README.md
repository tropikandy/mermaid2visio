# Mermaid2Visio

**Mermaid2Visio** is a powerful utility that converts [MermaidJS](https://mermaid.js.org/) diagrams into native, editable Microsoft Visio (`.vsdx`) files. 

Unlike static image exports, this tool generates true Visio objects:
- **Subgraphs** become draggable **Containers**.
- **Nodes** become editable **Shapes**.
- **Links** become **Connectors** (with orthogonal routing support).
- **Hyperlinks** are preserved.
- **Styles** (colors, strokes, text alignment) are mapped to Visio cell properties.

## Features

- 🚀 **Native VSDX Generation**: Produces files compatible with Microsoft Visio 2013+.
- 📂 **Container Support**: Maps Mermaid `subgraph` to Visio Containers for better organization.
- 🎨 **Rich Styling**: Supports CSS styles for fill, stroke, dash-arrays, and text alignment.
- 🔗 **Interactive**: Preserves hyperlinks defined in Mermaid (`click` directive).
- 🤖 **AI Ready**: Includes a **Model Context Protocol (MCP)** server for integration with AI agents like Claude Desktop.
- 💻 **CLI & Context Menu**: Run from command line or right-click files in Windows.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- npm

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mermaid2visio.git
   cd mermaid2visio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Usage

### 1. Command Line Interface (CLI)
You can convert any `.mmd` or `.md` (containing mermaid blocks) file directly:

```bash
node dist/index.js path/to/diagram.mmd
```
The tool will generate `path/to/diagram.vsdx` in the same directory.

### 2. Windows Context Menu
For quick access, you can add a "Convert to Visio" option to your Windows right-click menu:

1. Double-click `install_context_menu.bat` in the root directory.
2. Now, simply right-click any `.mmd` or `.md` file and select **Convert to Visio**.

### 3. MCP Server (AI Integration)
This project enables AI agents to generate Visio files for you. It implements the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).

**Configuration for Claude Desktop:**
Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mermaid2visio": {
      "command": "node",
      "args": [
        "C:/path/to/mermaid2visio/dist/server.js"
      ]
    }
  }
}
```
*Note: Replace `C:/path/to/...` with the absolute path to your project.*

Once configured, you can ask Claude:
> "Generate a system architecture diagram for a web app and save it as a Visio file."

## Documentation
For detailed instructions on how to write Mermaid diagrams that translate perfectly to Visio (including shape mappings and styling tips), see the [User Manual](docs/MANUAL.md).

## Testing
Run the automated test suite with:
```bash
npm test
```
See [TESTING.md](docs/TESTING.md) for more details.

## License
ISC
