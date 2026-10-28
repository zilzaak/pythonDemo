@echo off
REM Use local Node 16
set "LOCAL_NODE=%~dp0\node-local\node-v16.20.2-win-x64"
set "PATH=%LOCAL_NODE%;%LOCAL_NODE%\npm;%PATH%"

REM Install/use local dependencies
call npm install --legacy-peer-deps

REM Run using project's Angular CLI (NOT global)
call npm start

REM Alternative: npx ng serve