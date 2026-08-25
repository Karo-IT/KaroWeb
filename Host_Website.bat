@echo off
title Karo Personal Website Local Host
echo ==========================================================
echo  Starting Local Web Server for Karo Personal Website...
echo  Local URL: http://localhost:8080/
echo ==========================================================
start http://localhost:8080/
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
