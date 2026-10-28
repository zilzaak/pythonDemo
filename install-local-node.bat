@echo off
echo Downloading Node 16 for this project only...
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v16.20.2/node-v16.20.2-win-x64.zip' -OutFile 'node-local.zip'"
powershell -Command "Expand-Archive -Path 'node-local.zip' -DestinationPath 'node-local' -Force"
del node-local.zip
echo Node 16 installed locally!