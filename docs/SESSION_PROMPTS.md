# Session prompts (reference)

Prompts from the Cursor Cloud Agent session that set up this Expo app.
Kept for handoff / continuity — not product requirements.

## 1. Initial request

> Create react native ios app & run the dev server and send me a url i can open in my expo go app

## 2. Expo Go incompatibility (screenshot)

User sent a screenshot from Expo Go on iOS:

- **Error:** “Project is incompatible with this version of Expo Go”
- **Detail:** “The project you requested requires a newer version of Expo Go.”
- **Fix shown in app:** “Download the latest version of Expo Go from the App Store.”
- **Project URL on screen:** `exp://98yfqe4-anonymous-8081.exp.direct`

(No text prompt beyond the image.)

**Outcome:** Project was on Expo SDK 57; App Store Expo Go only supports SDK 54. Downgraded to SDK 54.

## 3. Document for next session

> Its working,
> Document the work so next session we can continue

**Outcome:** Expanded `README.md` and `AGENTS.md` handoff notes.

## 4. URL generation script

> Create a script to general url

(Interpreted as: create a script to **generate** the Expo Go URL.)

**Outcome:** Added `scripts/generate-expo-url.sh` and `npm run url`.

## 5. Validate the script

> Generate the url with the script so i can validate

**Outcome:** Ran `npm run url` → `exp://98yfqe4-anonymous-8081.exp.direct`

## 6. Commit prompts for reference

> In the commit add all my prompts for reference

**Outcome:** This file.

## 7. Agent workflow rules

> Add these rules
> - implement all features via tdd
> - log all the user prompts
> - as part of the implementation, always generate a url to allow the user to test the app locally

**Outcome:** Added constraints 4–6 to `AGENTS.md`; logged this prompt here.

## 8. Flower home page

> Create a beautiful home page with flowers background

**Outcome:** Full-bleed floral home screen in `App.tsx` with brand-forward layout, tests, and Expo Go test URL.

## 9. Clickable Expo URL

> Ensure the url is always clickable

**Outcome:** `npm run url` prefers a clickable `https://*.exp.direct` tunnel link (keeps `exp://` as fallback) and waits past localhost until the tunnel host is ready.

## 10. HTTPS link opened manifest JSON

> (Screenshot) Opening `https://9r9uaby-anonymous-8081.exp.direct` in Safari showed the Expo manifest JSON instead of launching Expo Go.

**Outcome:** Switch the clickable share URL to an Expo Go launcher link that opens the app, not the raw tunnel manifest.
