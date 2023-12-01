import { RuleSet } from "./analyze-ruleset";

export const IonicRuleSet: RuleSet = {
    metrics: [
        { name: 'Plugins', weight: 1 },
        { name: 'Framework', weight: 3 },
        { name: 'Platform', weight: 5 },
        { name: 'Ionic', weight: 2 }
    ],
    metricRules: [
        {
            metricTypeName: "Plugins",
            pluginTypes: ["Capacitor", "Cordova"]
        },
        {
            metricTypeName: "Platform",
            dependencies: ["cordova-ios", "cordova-android", "cordova", "@capacitor/cli", "@capacitor/android", "@capacitor/ios", "@capacitor/core"]
        },
        {
            metricTypeName: "Ionic",
            dependencies: ["@ionic/react", "@ionic/vue", "@ionic/angular", "@ionic/*"]
        },
        {
            metricTypeName: "Framework",
            dependencies: ["react", "vue", "@angular/core", "react-*", "vue-*", "@vue/*", "@angular-eslint/*", "@angular-devkit/*", "@angular/*"]
        },
        {
            metricTypeName: "Plugins",
            dependencies: ["@ionic-native/*", "@awesome-cordova-plugins/*"]
        }        
    ],
  rules: [
    { type: 'Major', dependency: '@angular/core', note: 'Migrate Angular from v@current to v@latest'  },
    { type: 'Major', dependency: '@capacitor/core', note: 'Migrate Capacitor from v@current to v@latest'  },
  ]
}