# kwagenda — agent notes

## Must read before coding

- Expo SDK **54** docs: https://docs.expo.dev/versions/v54.0.0/
- Handoff / how to run: [README.md](./README.md)
- Original setup prompts: [docs/SESSION_PROMPTS.md](./docs/SESSION_PROMPTS.md)

## Hard constraints

1. **Stay on Expo SDK 54** unless the user explicitly upgrades Expo Go past the App Store build. App Store Expo Go does not support SDK 55+.
2. For Cloud Agent + physical phone testing, use `npm run url` (or `npx expo start --tunnel`; needs `@expo/ngrok`).
3. Prefer `npx expo install <package>` so versions match SDK 54.
4. **Implement all features via TDD** — write failing tests first, then implement until green; do not ship feature code without corresponding tests.
5. **Log all user prompts** — append every user prompt from the session to [docs/SESSION_PROMPTS.md](./docs/SESSION_PROMPTS.md) (keep outcomes brief).
6. **Always generate a local test URL** as part of implementation — after changes, run `npm run url` and surface the **clickable** `https://*.exp.direct` tunnel link (plus `exp://` fallback). Never present `localhost` / `127.0.0.1` as the shareable test URL. In chat, format it as a Markdown link so it stays tappable.

## Where to continue

- UI / product work starts in `App.tsx`.
- Branch with working Expo Go setup: `cursor/expo-react-native-app-327c` (PR #1).
