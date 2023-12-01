export interface RuleSet {
    metrics: MetricType[];
    metricRules: MetricRule[];
    rules: Rule[];
}

export interface MetricType {
    name: string;
    weight: number;
}

export interface MetricRule {    
    dependencies?: string[]; // Dependencies that match this metric
    metricTypeName: string; // Resulting metric name
    pluginTypes?: string[]; // Matching plugin types
}

export interface Rule {
    type: RecommendationType,
    dependency: string,
    note: string
}

export type RecommendationType = 'Major' | 'Error';