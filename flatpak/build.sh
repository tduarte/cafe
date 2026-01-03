#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Building Cafe Flatpak..."

# Ensure the app is built
pnpm build
pnpm bundle

# Copy native module to dist for Flatpak
mkdir -p dist
cp ../../packages/native/index.node dist/index.node || cp node_modules/@gtkx/native/index.node dist/index.node 2>/dev/null || true

# Build the Flatpak
flatpak-builder \
    --force-clean \
    --user \
    --install-deps-from=flathub \
    --disable-rofiles-fuse \
    --repo=flatpak-repo \
    build-dir \
    flatpak/io.github.tduarte.cafe.yaml

# Create the bundle
flatpak build-bundle \
    flatpak-repo \
    dist/io.github.tduarte.cafe.flatpak \
    io.github.tduarte.cafe

echo "Flatpak built: dist/io.github.tduarte.cafe.flatpak"
echo ""
echo "To install:"
echo "  flatpak install --user dist/io.github.tduarte.cafe.flatpak"
echo ""
echo "To run:"
echo "  flatpak run io.github.tduarte.cafe"
