#!/bin/bash

# Coffee Calculator Dev Server Launcher
# This script runs the GTKx dev server inside the distrobox container

set -e

# Check if distrobox is available
if ! command -v distrobox &> /dev/null; then
    echo "Error: distrobox is not installed or not in PATH"
    exit 1
fi

# Check if the container exists
if ! distrobox list | grep -q "coffee-calc-dev"; then
    echo "Error: coffee-calc-dev container not found"
    echo "Please create it first with: distrobox create --name coffee-calc-dev --image registry.fedoraproject.org/fedora-toolbox:latest"
    exit 1
fi

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "Starting Coffee Calculator dev server..."
echo "Project root: $PROJECT_ROOT"
echo ""

# Run the dev server in the distrobox container
distrobox enter coffee-calc-dev -- bash -c "cd '$PROJECT_ROOT/examples/coffee-calculator' && pnpm run dev"

