
import { SecurityVulnerability } from './inspect';
import { verbose, writeError } from './log';
import { getRunOutput } from './utilities';

export async function audit(folder: string, dependencies: string[]): Promise<SecurityVulnerability[] | undefined> {
    try {
        const data = await getRunOutput('npm audit --json', folder);
        try {
            const audit: Audit = JSON.parse(stripJSON(data, '{'));
            return completeAudit(dependencies, audit);
        } catch (error) {
            writeError('AuditError: npm audit --json failed');
            verbose(data);
        }

    } catch (error) {
        writeError(`AuditError: Security Audit did not run.`);
        verbose(`${error}`);
    }
    return undefined;
}

function drillDown(name: string, audit: Audit): Source | undefined {
    for (const source of audit.vulnerabilities[name].via) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(source as any).title) {
            return drillDown(source as string, audit);
        } else {
            const src: Source = source as Source;
            return src;
        }
    }
}

function completeAudit(dependencies: string[], audit: Audit): SecurityVulnerability[] {
    const result: SecurityVulnerability[] = [];
    for (const name of Object.keys(audit.vulnerabilities)) {
        const v: Vulnerability = audit.vulnerabilities[name];

        if (dependencies.includes(name)) {

            const source = drillDown(name, audit);
            result.push({
                name,
                severity: v.severity,
                title: source ? source.title : '',
                url: source ? source.url : ''
            });
        }
    }
    return result;
}

interface Vulnerability {
    name: string;
    severity: string;
    isDirect: boolean;
    via: Array<Source | string>;
    effects: string[];
    range: string;
    nodes: string[];
    fixAvailable: boolean;
}

interface Source {
    source: number;
    name: string;
    dependency: string;
    title: string;
    url: string;
    severity: string;
    cwe: string[];
    cvss: Cvss;
    range: string;
}

interface Cvss {
    score: number;
    vectorString: string;
}

interface Audit {
    auditReportVersion: number;
    vulnerabilities: Record<string, Vulnerability>;
    metadata: AuditMetadata;
}

interface AuditMetadata {
    vulnerabilities: VulnerabilitiesMeta;
    dependencies: DependenciesMeta;
}

interface VulnerabilitiesMeta {
    info: number;
    low: number;
    moderate: number;
    high: number;
    critical: number;
    total: number;
}

interface DependenciesMeta {
    prod: number;
    dev: number;
    optional: number;
    peer: number;
    peerOptional: number;
    total: number;
}

export function stripJSON(txt: string, startText: string): string {
    // This removed output from nvm from json
    const idx = txt.indexOf(startText);
    if (idx != -1) {
        return txt.substring(idx);
    }
    return txt;
}