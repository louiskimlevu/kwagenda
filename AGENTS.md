# kwagenda — agent notes

## Must read before coding

- Expo SDK **54** docs: https://docs.expo.dev/versions/v54.0.0/
- Handoff / how to run: [README.md](./README.md)

## Hard constraints

1. **Stay on Expo SDK 54** unless the user explicitly upgrades Expo Go past the App Store build. App Store Expo Go does not support SDK 55+.
2. For Cloud Agent + physical phone testing, use `npm run url` (or `npx expo start --tunnel`; needs `@expo/ngrok`).
3. Prefer `npx expo install <package>` so versions match SDK 54.

## Where to continue

- UI / product work starts in `App.tsx`.
- Branch with working Expo Go setup: `cursor/expo-react-native-app-327c` (PR #1).
