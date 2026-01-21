@echo off
set "PROJECT_DIR=%~dp0"
set "NODE_EXE=node"
set "SCRIPT_PATH=%PROJECT_DIR%dist\index.js"

echo Installing Mermaid2Visio Context Menu...
echo Project Directory: %PROJECT_DIR%

:: Register for .mmd
reg add "HKCU\Software\Classes\SystemFileAssociations\.mmd\shell\Mermaid2Visio" /ve /d "Convert to Visio" /f
reg add "HKCU\Software\Classes\SystemFileAssociations\.mmd\shell\Mermaid2Visio\command" /ve /d "cmd /k \"%NODE_EXE%\" \"%SCRIPT_PATH%\" \"%%1\"" /f

:: Register for .md
reg add "HKCU\Software\Classes\SystemFileAssociations\.md\shell\Mermaid2Visio" /ve /d "Convert to Visio" /f
reg add "HKCU\Software\Classes\SystemFileAssociations\.md\shell\Mermaid2Visio\command" /ve /d "cmd /k \"%NODE_EXE%\" \"%SCRIPT_PATH%\" \"%%1\"" /f

echo.
echo Success! You can now right-click .mmd or .md files and select "Convert to Visio".
pause
