# PackageUp

PackageUp creates Health reports for your project to help you keep it up to date.

## Getting Started
Run `npx pkup` in your project's folder.

This will create a health report outputed to the command line.

## Arguments
- `--type html` - This will generate a `package-health.html` file.
- `--type md` - This will generate a `package-health.md` file.

## Advanced Arguments
- `--verbose` extra logging
- `--path` path to the projects package.json otherwise uses current folder

# Roadmap
This are some ideas for features to be implemented:
- Argument to send results via email
- Only send out emails monthly
- Add Security Vulnerabilities
- Expose the ruleset json so you can define your own rules
- Rules for recommended replacement packages
- Detect deprecated packages
- Detect unmaintained packages
