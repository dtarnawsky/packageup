import { Metric, ProjectResult, Recommendation } from "./analyze";
import { DependencyInfo, IssueType } from "./inspect";
import { write } from "./log";
import { colorEmoji, colorSeverity, countIssues, toTitleCase } from "./report";

export function outputTxt(result: ProjectResult): string {
    const issues = countIssues(result);


    write(`${colorEmoji(result.score)} ${toTitleCase(result.project.name)} v${result.project.version} scored ${result.score}% using packageup.io`);
    //const url = result.project.remoteUrl ?? 'https://packageup.io';

    write(' ');
    write(`This score was based on these categories:`);

    for (const key of metricList(result.metrics)) {
        write(`${colorEmoji(result.metrics[key].score)} ${key} - ${result.metrics[key].score}%`);
    }
    const securitySeverity = highestSeverity(result.security);
    let securityNote = 'No issues';
    let colorSecurity = colorSeverity(securitySeverity);
    if (securitySeverity == '') {
        colorSecurity = '🟩';
    } else {
        securityNote = `${toTitleCase(securitySeverity)} severity issues`;
    }
    if (result.project.securityAuditFailed) {
        colorSecurity = '🟥';
        securityNote = `Security Audit Failed`;
    }
    if (security.length > 0) {
        write(`${colorSecurity} Security - ${securityNote}`);
    }
    if (issues) {
        write(' ');
        write(`Improve your project by addressing these items:`);
        notes(result);
    }

    if (result.security.length > 0) {
        write(' ');
        write(`Your project has Security Vulnerabilities:`);
        security(result);
        write(`Run "npm audit" to investigate further.`);
    }

    if (result.issues.length > 0) {
        write(' ');
        const types: IssueType[] = ['maintenance', 'potentialUnmaintained'];
        for (const type of types) {
            if (hasIssues(result, type)) {
                write(`Your project is using these ${nameForIssueType(type)} dependencies:`);
                otherIssues(result, type);
                write(' ');
            }
        }
    }

    return '';
}

function hasIssues(result: ProjectResult, type: IssueType): boolean {
    return (result.issues.find(d => d.issue?.type == type) != undefined);
}

function nameForIssueType(type: IssueType): string {
    if (type == 'maintenance') {
        return 'unmaintained';
    }
    if (type == 'potentialUnmaintained') {
        return 'potentially unmaintained';
    }
    return 'xxxx';
}

function highestSeverity(issues: DependencyInfo[]): string {
    if (issues.find(i => i.security?.severity == 'critical')) {
        return 'critical';
    }
    if (issues.find(i => i.security?.severity == 'high')) {
        return 'high';
    }
    if (issues.find(i => i.security?.severity == 'moderate')) {
        return 'moderate';
    }
    if (issues.find(i => i.security?.severity == 'low')) {
        return 'low';
    }
    return '';
}

function metricList(metrics: Record<string, Metric>): string[] {
    const values = Object.keys(metrics);
    return values.sort((a: string, b: string) => metrics[a].score - metrics[b].score);
}

function byPriority(recommendations: Recommendation[]): Recommendation[] {
    return recommendations.sort((a: Recommendation, b: Recommendation) => a.priority.localeCompare(b.priority));
}

function security(result: ProjectResult) {
    for (const dep of result.security) {
        write(`${colorSeverity(dep.security?.severity)} ${dep.name} - ${dep.security?.title}`);
    }
}

function otherIssues(result: ProjectResult, type: IssueType) {
    for (const dep of result.issues) {
        if (dep.issue?.type == type) {
            write(`${colorSeverity(dep.issue?.severity)} ${dep.name} - ${dep.issue?.title}`);
        }
    }
}

function notes(result: ProjectResult) {
    for (const key of Object.keys(result.metrics)) {
        if (result.metrics[key].majorNote) {
            write(`- ${result.metrics[key].majorNote} ⭐`);
        }
    }
    for (const key of Object.keys(result.metrics)) {
        if (!result.metrics[key].majorNote) {
            for (const item of byPriority(result.metrics[key].recommendations)) {
                if (item.priority == 'High') {
                    write(`- ${item.notes} ⭐`);
                } else {
                    write(`- ${item.dependency} - ${item.notes}`);
                }
            }
        }
    }
}