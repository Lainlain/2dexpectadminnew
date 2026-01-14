#!/bin/bash

echo "========================================"
echo "🎨 2D Expect Admin - Setup & Start"
echo "========================================"
echo ""

# Navigate to Vue directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
fi

# Create .env.local if not exists
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating .env.local..."
    cp .env.example .env.local
    echo "✅ Created .env.local (edit if needed)"
    echo ""
fi

echo "🚀 Starting development server..."
echo "📱 App will be available at: http://localhost:3000"
echo "🔌 Backend should be running at: http://localhost:4545"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
