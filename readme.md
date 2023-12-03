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

# Roadmap
This are some ideas for features to be implemented:
1. Argument to send results via email
1. Only send out emails monthly
1. Rules for recommended replacement packages
1. Detect deprecated packages
1. Detect unmaintained packages
1. Add Security Vulnerabilities
1. Expose the ruleset json so you can define your own rules

