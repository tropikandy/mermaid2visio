import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseMermaid } from './parser.js';
import { VsdxGenerator } from './vsdx.js';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Mermaid to Visio</title>
    <style>
        body { font-family: sans-serif; margin: 0; display: flex; height: 100vh; flex-direction: column; }
        header { background: #0078d4; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .container { display: flex; flex: 1; overflow: hidden; }
        .pane { flex: 1; display: flex; flex-direction: column; padding: 1rem; border-right: 1px solid #ccc; }
        textarea { flex: 1; font-family: monospace; padding: 0.5rem; resize: none; }
        #preview { flex: 1; border: 1px solid #eee; background: #fafafa; padding: 1rem; overflow: auto; display: flex; justify-content: center; }
        button { background: white; color: #0078d4; border: none; padding: 0.5rem 1rem; font-weight: bold; cursor: pointer; border-radius: 4px; }
        button:hover { background: #e1f5fe; }
    </style>
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ startOnLoad: false });

        window.updatePreview = async () => {
            const input = document.getElementById('input').value;
            const preview = document.getElementById('preview');
            try {
                preview.innerHTML = '';
                const { svg } = await mermaid.render('graphDiv', input);
                preview.innerHTML = svg;
            } catch (e) {
                preview.innerHTML = '<div style="color:red">' + e.message + '</div>';
            }
        };

        window.convert = async () => {
            const input = document.getElementById('input').value;
            const btn = document.getElementById('convertBtn');
            btn.innerText = 'Converting...';
            
            try {
                const res = await fetch('/convert', {
                    method: 'POST',
                    body: input
                });
                if (!res.ok) throw new Error(await res.text());
                
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'diagram.vsdx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } catch (e) {
                alert('Error: ' + e.message);
            } finally {
                btn.innerText = 'Download VSDX';
            }
        };
    </script>
</head>
<body>
    <header>
        <span>Mermaid 2 Visio</span>
        <button id="convertBtn" onclick="convert()">Download VSDX</button>
    </header>
    <div class="container">
        <div class="pane">
            <h3>Mermaid Code</h3>
            <textarea id="input" oninput="updatePreview()" placeholder="graph TD\n  A --> B">graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]</textarea>
        </div>
        <div class="pane">
            <h3>Preview</h3>
            <div id="preview"></div>
        </div>
    </div>
    <script>
        // Initial render
        setTimeout(window.updatePreview, 500);
    </script>
</body>
</html>
`;

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    if (req.method === 'POST' && req.url === '/convert') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                console.log("Received conversion request...");
                const graph = await parseMermaid(body);
                const generator = new VsdxGenerator();
                const buffer = await generator.generate(graph);
                
                res.writeHead(200, {
                    'Content-Type': 'application/vnd.ms-visio.drawing',
                    'Content-Disposition': 'attachment; filename="diagram.vsdx"'
                });
                res.end(buffer);
                console.log("Sent VSDX.");
            } catch (e: any) {
                console.error(e);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(e.message);
            }
        });
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`GUI Server running at http://localhost:${PORT}`);
    // Try to open browser
    const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    exec(`${start} http://localhost:${PORT}`);
});
