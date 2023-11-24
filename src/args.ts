
export function getArg(name: string, defaultValue: string): string {
    try {
        let next = false;
        for (const arg of process.argv) {
            if (arg == `--${name}`) {
                next = true;
            } else if (next) {
                return arg;
            }
        }
        return defaultValue;
    } catch {
        return defaultValue;
    }
}

export function hasArg(name: string): boolean {
    try {
        for (const arg of process.argv) {
            if (arg == `--${name}`) {
                return true;
            }
        }
        return false;
    } catch {
        return false;
    }
}