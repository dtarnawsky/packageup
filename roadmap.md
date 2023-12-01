# Roadmap

## Analyse
- `ProjectInfo` (from `inspect`) > `ProjectResults`
- Rule of major versions behind (20% per version)
- Rule of minor versions behind (1% per version)
- Group by knowns: 
   - `@capacitor/core` > `Platform`
   - `@ionic/angular` > `Framework`
   - `@angular/core` > `Framework`
   - `capacitor` > `Plugins`
   - `cordova` > `Plugins`
   - rest > `Other Dependencies`

```typescript
{ metrics: { 'platform': { score: 80 } },
  project: projectInfo
  }
```

## Report
- Report as HTML page from `ProjectResults`

## Next Steps

### v0.0.1
- Generate `package-health.md`
- Graphs in `md` file or use `shields.io` for health
- Add to post install steps of `package.json`

### v0.0.2
- Generate HTML with a flag `--type html`
- Add to `readme.md` ? Not sure if needed

### v0.0.3
- Recommendation rules language to allow you to customize how you see health

### v0.0.4
- Track history with `package-history.json`
- Generate recommendations based on history ?

## v0.0.5
- Send email ?

## Future
- Email: Send description of the project with overall % and issue count and CTA "Next Steps"
- Link to Web App that delivers news.
- `POST` to api
- Store in Sqlite
- Email HTML if last email > last email was previous month
- Compare with last and report
  - Bad news if major version bumped: provide url
  - Good news if user increased score
  - Bad news if metric dropped below color threshold (75, 50, 25)
- Bounces on emails are a problem that should be handled with an unsubscribe

## Stickiness Concepts
- Monthly emails become a source for what is new in their project (eg Angular 17, Ionic v7) and any additional detail on these is super important. It is worth finding the best urls for announcements (eg `https://blog.angular.io/introducing-angular-v17-4d7033312e4b`) and using for when latest is that version and current is less.
- Speed to get the first report is important so `npx packageup` should ask for email and send first one. It should write a token into `package.json`.
- Tell user to add `npx packageup` to their CI process for regular monthly updates. Key is the "monthly" so they know they arent getting spammed.
- Multiple projects should be joined in one email