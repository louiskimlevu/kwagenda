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
