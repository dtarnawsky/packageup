import { exec, ExecException, ExecOptionsWithStringEncoding } from 'child_process';
import { verbose, writeError } from './log';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export async function run(commands: Array<string>, folder: string): Promise<void> {
    for (const command of commands) {
        try {
            verbose(await getRunOutput(command, folder));
        } catch (err) {
            writeError(err as string);
            break;
        }
    }
}

export async function getAsJson(command: string, folder: string) {
    try {
        const listJson = await getRunOutput(command, folder);
        return JSON.parse(listJson);
    } catch (err) {
        verbose(`${command} returned ${err}`);
        return undefined;
    }
}

export async function getAsString(command: string, folder: string): Promise<string | undefined> {
    try {
        return await getRunOutput(command, folder);
    } catch (err) {
        verbose(`${command} returned ${err}`);
        return undefined;
    }
}

export async function getRunOutput(
    command: string,
    folder: string,
    shell?: string,
    hideErrors?: boolean
): Promise<string> {
    return new Promise((resolve, reject) => {
        let out = '';
        command = qualifyCommand(command, folder);
        verbose(`> ${command}`);
        exec(command, runOptions(command, folder, shell), (error: ExecException | null, stdout: string, stdError: string) => {
            if (stdout) {
                out += stdout;
            }
            if (!error) {
                if (out == '' && stdError) {
                    out += stdError;
                }
                resolve(out);
            } else {
                if (stdError) {
                    if (stdError && stdError.startsWith('Debugger attached.')) {
                        resolve(out);
                        return;
                    }
                    if (!hideErrors) {
                        writeError(stdError);
                    } else {
                        console.error(stdError);
                    }
                    reject(stdError);
                } else {
                    // This is to fix a bug in npm outdated where it returns an exit code when it succeeds
                    resolve(out);
                }
            }
        });
    });
}

function runOptions(command: string, folder: string, shell?: string): ExecOptionsWithStringEncoding {
    const env = { ...process.env };

    // Cocoapods required lang set to en_US.UTF-8 (when capacitor sync or run ios is done)
    if (!env.LANG) {
        env.LANG = 'en_US.UTF-8';
    }

    return { cwd: folder, shell, encoding: 'utf8', env: env, maxBuffer: 10485760 };
}

let nvm: string | undefined;
function qualifyCommand(command: string, folder: string): string {
    if (process.env.NVM_DIR) {
        if (!nvm) {
            const nvmrc = join(folder, '.nvmrc');
            if (existsSync(nvmrc)) {
                const txt = readFileSync(nvmrc, 'utf-8').replace('\n', '');
                nvm = `source ${process.env.NVM_DIR}/nvm.sh && nvm use`;
                verbose(`Detected nvm (${txt}) for this project.`);
            }
        }
        if (nvm) {
            return `${nvm} && ${command}`;
        }
    }
    return command;
}