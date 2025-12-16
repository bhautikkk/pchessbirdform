@echo off
echo ===================================================
echo Starting Local Chess Website Server...
echo ===================================================
echo This allows the Contact Form to work correctly.
echo.
echo Opening browser at http://localhost:8000 ...
start http://localhost:8000
echo.
echo Server is running. Close this window to stop the server.
python -m http.server 8000
pause
