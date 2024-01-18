# PackageUp

[PackageUp](https://packageup.io) creates Health reports for your project to help you keep it up to date.

## Getting Started
Run `npx pkup` in your project's folder.

This will create a health report outputed to the command line.

## Arguments
- `--type html` - This will generate a `package-health.html` file.
- `--type md` - This will generate a `package-health.md` file.
- `--install` - Create a `postinstall` script so that `pkup` runs when node modules are installed

## Advanced Arguments
- `--verbose` extra logging
- `--path` path to the projects package.json otherwise uses current folder