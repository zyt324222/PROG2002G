@echo off
cd /d %~dp0\usernameA2-clientside

echo 🚀 Starting frontend with http-server at http://localhost:8080
http-server -p 8080
