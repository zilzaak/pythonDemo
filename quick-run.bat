@echo off
set "LOCAL_NODE=%~dp0\node-local\node-v16.20.2-win-x64"
set "PATH=%LOCAL_NODE%;%PATH%"
npm start