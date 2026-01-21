# Contributing to Mermaid2Visio

Thank you for your interest in contributing! We want to make this tool the standard for converting Mermaid diagrams to editable Visio files.

## How to Contribute

### Reporting Bugs
- Open an issue in the issue tracker.
- Include the Mermaid code that caused the issue.
- Describe what happened vs. what you expected to happen.

### Local Development
1. **Clone the repo**:
   ```bash
   git clone https://github.com/tropikandy/mermaid2visio.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Build the project**:
   ```bash
   npm run build
   ```
4. **Run Tests**:
   ```bash
   npm test
   ```

### Pull Requests
1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`).
3. Add a test case in `tests/` if applicable.
4. Ensure `npm test` passes.
5. Commit your changes.
6. Push to the branch and open a Pull Request.

## Coding Standards
- We use **TypeScript** for strict type safety.
- We favor **ES Modules** (`import`/`export`).
- No local Visio dependency is allowed in the core logic (Node.js only).
