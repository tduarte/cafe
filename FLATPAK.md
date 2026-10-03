# Flatpak

Cafe is packaged with `gtkx deploy`, which generates the Flatpak manifest, desktop entry and
AppStream metainfo from `gtkx.config.ts` and bundles its own Node.js runtime. There is no
hand-written manifest in this repository.

## Prerequisites

```bash
sudo dnf install flatpak flatpak-builder   # or your distro's equivalent
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak install flathub org.gnome.Platform//50 org.gnome.Sdk//50
```

GTKX needs GTK 4.20+ and Libadwaita 1.8+, so the GNOME 50 runtime is the minimum.

## Build

```bash
pnpm build:flatpak    # gtkx deploy --target flatpak
```

The bundle lands in `build/out/`. To inspect the generated manifest and metadata without packaging:

```bash
pnpm exec gtkx deploy --target flatpak --print-manifests
# → build/targets/flatpak/io.github.tduarte.cafe.yml, build/metadata/
```

## Install and run

```bash
flatpak install --user build/out/io.github.tduarte.cafe-1.0.0-x86_64.flatpak
flatpak run io.github.tduarte.cafe
```

## Publishing

Tagged releases are signed and published to a Flatpak repository on GitHub Pages by
`.github/workflows/release.yml`. See [docs/RELEASING.md](docs/RELEASING.md).

## Changing packaging metadata

Edit the `deploy` block in `gtkx.config.ts` (name, summary, description, categories, developer,
screenshots, releases). App icons come from `data/icons/` in the hicolor layout.
