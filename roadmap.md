# Roadmap

## Next Steps

### v0.0.1
- Add to `scripts` > `postinstall` of `package.json`
- Write to command line as text with emojis (so that it appears in logs)
- If `interactive` then `Would you like a monthly comparitive reported emailed to you?`

### v0.0.2
- Email should be similar to the text with decent formatting (no history)
- Keep last update and hold onto it until month ends
- File format commands should be optional (or removed)

### v0.0.3
- Track history on `packageup.io`
- History can be used to know:
  - When there is a major release (link to changelog)
  - When there are minor releases (changelog)
  - When a package is deprecated
  - When a package is outdated (>1yr)
  - When the user upgraded (congratulate)

### v0.0.4
- Put rules in JSON so they can be customized via a url

### v0.0.5
- Multiple projects should be joined in one email

## Future
- Store in Sqlite
- Bounces on emails are a problem that should be handled with an unsubscribe

## Marketing
- Monthly emails become a source for what is new in their project (eg Angular 17, Ionic v7) and any additional detail on these is super important. It is worth finding the best urls for announcements (eg `https://blog.angular.io/introducing-angular-v17-4d7033312e4b`) and using for when latest is that version and current is less.
- Speed to get the first report is important so `npx packageup` should ask for email and send first one. It should write a token into `package.json`.
