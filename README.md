# Cafe

A simple, native GTK4 coffee beans and water ratio calculator for Linux desktop applications.

![Cafe](assets/io.github.tduarte.Cafe.svg)

## Features

- **Multiple Brewing Methods**: Supports Espresso, Pour Over, French Press, and AeroPress
- **Bidirectional Calculation**: Enter either coffee or water amount, and the other is automatically calculated
- **Unit Systems**: Switch between Metric (grams/ml) and Imperial (ounces/fl oz) units
- **Native GTK4**: Built with [GTKx](https://github.com/eugeniodepalo/gtkx) for a native Linux desktop experience
- **Adwaita Design**: Follows GNOME Human Interface Guidelines for a modern, consistent UI

## Screenshots

![Cafe Application](assets/Screenshot.png)

## Installation

### From Flatpak (Recommended)

First, build the Flatpak bundle:

```bash
# Build the Flatpak bundle
pnpm build:flatpak
```

This creates `dist/io.github.tduarte.cafe.flatpak`. Then install and run:

```bash
# Install from local bundle
flatpak install --user dist/io.github.tduarte.cafe.flatpak

# Run the application
flatpak run io.github.tduarte.cafe
```

See [FLATPAK.md](./FLATPAK.md) for detailed Flatpak build and deployment instructions.

### Building from Source

#### Prerequisites

- Node.js 22 or later
- pnpm
- Rust toolchain (for building native dependencies)
- GTK4 development libraries
- Libadwaita development libraries

#### Setup

```bash
# Clone the repository
git clone https://github.com/tduarte/cafe.git
cd cafe/examples/coffee-calculator

# Install dependencies
pnpm install

# Build the application
pnpm build

# Run in development mode
pnpm dev

# Run the production build
pnpm start
```

## Usage

1. **Select a Brewing Method**: Choose from Espresso, Pour Over, French Press, or AeroPress
2. **Enter Amount**: Type either the coffee amount or water amount
3. **View Result**: The corresponding amount is automatically calculated and displayed
4. **Change Units**: Open Preferences (Ctrl+,) to switch between Metric and Imperial units

### Supported Ratios

- **Espresso**: 1:2 (coffee:water)
- **Pour Over**: 1:15
- **French Press**: 1:12
- **AeroPress**: 1:11

## Development

### Project Structure

```
coffee-calculator/
├── src/
│   ├── app.tsx          # Main application component
│   ├── index.tsx        # Production entry point
│   ├── dev.tsx          # Development entry point
│   └── utils/
│       └── calculations.ts  # Calculation logic and unit conversions
├── flatpak/             # Flatpak packaging files
├── scripts/             # Build scripts
└── assets/              # Application assets (icons, etc.)
```

### Building for Distribution

```bash
# Build TypeScript
pnpm build

# Bundle JavaScript
pnpm bundle

# Build Flatpak
pnpm build:flatpak
```

See [FLATPAK.md](./FLATPAK.md) for detailed Flatpak deployment instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Built with [GTKx](https://github.com/eugeniodepalo/gtkx) - Build native GTK4 desktop applications with React and TypeScript
- Uses [Adwaita](https://gnome.pages.gitlab.gnome.org/libadwaita/) design system for GNOME applications

## Author

**Thiago Duarte**

- GitHub: [@tduarte](https://github.com/tduarte)

