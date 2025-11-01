@echo off
echo =============================================
echo  Wedding Gallery Image Compression Tool
echo =============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Pillow is installed
python -c "import PIL" >nul 2>&1
if errorlevel 1 (
    echo Pillow library not found. Installing...
    pip install Pillow
    if errorlevel 1 (
        echo Failed to install Pillow. Please install manually: pip install Pillow
        pause
        exit /b 1
    )
)

REM Run the compression script
echo Starting image compression...
echo.
python compress_images.py

echo.
echo =============================================
echo Process completed!
echo =============================================
pause