# Flatpak Deployment Guide for Cafe

This guide explains how to build and distribute Cafe as a Flatpak.

## Prerequisites

### 1. Install Flatpak and flatpak-builder

```bash
# On Fedora/RHEL
sudo dnf install flatpak flatpak-builder

# On Ubuntu/Debian
sudo apt install flatpak flatpak-builder

# On Arch Linux
sudo pacman -S flatpak flatpak-builder
```

### 2. Install GNOME Platform Runtime

```bash
# Add Flathub repository
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo

# Install GNOME Platform 48 SDK and runtime
flatpak install flathub org.gnome.Platform//48 org.gnome.Sdk//48 org.freedesktop.Sdk.Extension.node22//22.10
```

### 3. Install postject (for SEA build)

```bash
npm install -g postject
```

Or use `npx postject` (which is what the build script does).

## Build Process

The Flatpak build process consists of three steps:

1. **Bundle** - Bundle JavaScript code with esbuild
2. **SEA** - Create Single Executable Application with Node.js
3. **Flatpak** - Package everything into a Flatpak

### Quick Build

Simply run:

```bash
cd examples/coffee-calculator
pnpm build:flatpak
```

This will:
- Bundle the TypeScript/React code
- Create a single executable application (SEA)
- Build the Flatpak bundle

The output will be at: `dist/io.github.tduarte.cafe.flatpak`

### Step-by-Step Build

If you want to run each step manually:

```bash
cd examples/coffee-calculator

# Step 1: Bundle JavaScript
pnpm bundle

# Step 2: Create Single Executable Application
pnpm build:sea

# Step 3: Build Flatpak
flatpak-builder \
    --force-clean \
    --user \
    --install-deps-from=flathub \
    --repo=flatpak-repo \
    build-dir \
    flatpak/io.github.tduarte.cafe.yaml

# Step 4: Create Flatpak bundle
flatpak build-bundle \
    flatpak-repo \
    dist/io.github.tduarte.cafe.flatpak \
    io.github.tduarte.cafe
```

## Installation

### Install from Local Bundle

```bash
flatpak install --user dist/io.github.tduarte.cafe.flatpak
```

### Run the Application

```bash
flatpak run io.github.tduarte.cafe
```

Or launch it from your application menu (it should appear as "Cafe").

## File Structure

```
examples/coffee-calculator/
├── flatpak/
│   ├── build.sh                    # Build script
│   ├── io.github.tduarte.cafe.yaml # Flatpak manifest
│   └── io.github.tduarte.cafe.desktop # Desktop entry
├── scripts/
│   ├── bundle.ts                    # esbuild bundler
│   └── build-sea.sh                # SEA build script
├── sea-config.json                  # SEA configuration
├── assets/
│   ├── io.github.tduarte.Cafe.svg              # Main application icon (scalable)
│   └── io.github.tduarte.Cafe-symbolic.svg     # Symbolic icon for UI elements
└── dist/                            # Build output
    ├── app                          # Single executable
    ├── index.node                   # Native GTK4 bindings
    └── io.github.tduarte.cafe.flatpak # Final Flatpak bundle
```

## Troubleshooting

### Build fails with "node not found"

Make sure Node.js 22 is installed and in your PATH. The Flatpak build uses the Node.js SDK extension, but the SEA build needs Node.js on your host system.

### "postject: command not found"

Install postject globally or ensure `npx` is available:
```bash
npm install -g postject
```

### Flatpak build fails with permission errors

Make sure you have write permissions in the project directory. The build creates `build-dir` and `flatpak-repo` directories.

### App doesn't start after installation

Check the Flatpak logs:
```bash
flatpak run --command=sh io.github.tduarte.cafe
# Then try running: /app/bin/cafe
```

Or check system logs:
```bash
journalctl --user -f
```

### Missing GTK4 libraries

The Flatpak manifest includes `org.gnome.Platform//48` which provides GTK4. If you see library errors, ensure the runtime is properly installed:
```bash
flatpak info org.gnome.Platform//48
```

## Distribution

To distribute your Flatpak:

1. **Upload to Flathub** (recommended for public apps):
   - Fork https://github.com/flathub/flathub
   - Add your app manifest
   - Submit a pull request

2. **Host your own repository**:
   ```bash
   # Create a repository
   flatpak build-export --repo=myrepo flatpak-repo io.github.tduarte.cafe
   
   # Serve it via HTTP/HTTPS
   # Users can add it with: flatpak remote-add myrepo https://your-domain.com/repo
   ```

3. **Direct distribution**:
   - Share the `.flatpak` bundle file
   - Users install with: `flatpak install --user your-app.flatpak`

## Additional Resources

- [GTKx Deploying Documentation](https://gtkx.dev/docs/deploying)
- [Flatpak Documentation](https://docs.flatpak.org/)
- [Flathub Submission Guide](https://github.com/flathub/flathub/wiki/App-Submission)

