#!/bin/bash

# YATRA Backend Quick Start Script

echo "🚀 YATRA Backend Quick Start"
echo "=============================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.9+"
    exit 1
fi

# Check Python version
python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "✅ Python $python_version found"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📚 Installing dependencies..."
pip install -q -r requirements.txt

# Load environment variables
if [ -f ".env" ]; then
    echo "⚙️  Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "ℹ️  No .env file found. Using defaults."
fi

# Show configuration
echo ""
echo "📋 Configuration:"
echo "   Port: ${PORT:-8000}"
echo "   Environment: ${ENVIRONMENT:-development}"
if [ ! -z "$MAPBOX_ACCESS_TOKEN" ]; then
    echo "   Mapbox: Configured ✅"
else
    echo "   Mapbox: Not configured (optional)"
fi

echo ""
echo "🎯 Starting YATRA Backend..."
echo ""

# Run the application
python main.py

# Deactivate virtual environment on exit
deactivate
