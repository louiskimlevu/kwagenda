# kwagenda

React Native iOS app built with **Expo SDK 54** (blank TypeScript template).

Verified working on a physical iPhone via **App Store Expo Go** + Expo tunnel from a Cursor Cloud Agent.

## Current status (handoff)

| Item | Value |
|------|--------|
| Branch | `cursor/expo-react-native-app-327c` |
| PR | https://github.com/louiskimlevu/kwagenda/pull/1 |
| SDK | Expo **54** (`expo ~54.0.35`, RN `0.81.5`) |
| Entry | `index.ts` → `App.tsx` |
| UI so far | Single home screen: brand `kwagenda` + subtitle |
| Last verified | Tunnel + Expo Go on iOS — working |

### Why SDK 54 (do not bump casually)

App Store Expo Go currently ships **SDK 54 only**. SDK 55+ is not on the store.

- Creating with latest `create-expo-app` defaults to a newer SDK → Expo Go error: *“Project is incompatible with this version of Expo Go”*.
- Stay on SDK 54 for App Store Expo Go, or install a newer Expo Go via [sign.expo.dev](https://sign.expo.dev/) / `eas go` if you intentionally upgrade.

Docs: https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/

## Project layout

```
App.tsx          # Root UI (edit here to continue the app)
index.ts         # Expo entry (registerRootComponent)
app.json         # Expo config (name/slug/scheme: kwagenda)
package.json     # Scripts + deps (@expo/ngrok for tunnel)
assets/          # Icons / splash
AGENTS.md        # Points agents at SDK 54 docs
```

## Setup

```bash
npm install
```

## Run for Expo Go (cloud / remote phone)

Phone is not on the same LAN as a Cloud Agent, so use **tunnel**:

```bash
npx expo start --tunnel
# or
npm run tunnel
```

Then open the printed URL in Expo Go, e.g.:

```text
exp://<subdomain>.exp.direct
```

Notes:

- Tunnel hostname changes each session; always use the URL from the current `expo start` output.
- Keep the Metro/tunnel process running while testing on device.
- `@expo/ngrok` is already a dependency (required for `--tunnel`).

## Run on same network (local machine)

```bash
npm start
```

Scan the QR code with the Camera app (iOS) or Expo Go (Android).

## Continue next session — suggested next steps

1. Check out `cursor/expo-react-native-app-327c` (or merge PR #1 into `main`).
2. `npm install` then `npx expo start --tunnel`.
3. Build real product UI in `App.tsx` (or introduce `app/` router later with `expo-router` — only if needed).
4. Add navigation, agenda data model, and persistence when product requirements are clear.
5. **Do not** upgrade Expo past SDK 54 unless Expo Go on the test device supports that SDK.

## Useful commands

| Command | Purpose |
|---------|---------|
| `npm start` | Metro (LAN) |
| `npm run tunnel` | Metro + public tunnel for Expo Go |
| `npx expo-doctor` | Dependency / SDK health check |
| `npx expo install <pkg>` | Install a package pinned to this SDK |

## References

- Expo SDK 54 docs: https://docs.expo.dev/versions/v54.0.0/
- Expo Go mismatch guide: https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/
