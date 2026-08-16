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

## 11. Floral agenda

> Implement the agenda,
> Floral theme

**Outcome:** Floral agenda screen (`Today’s bloom`) with seed plans, add/toggle, home ↔ agenda navigation, tests, and Expo Go test URL.

## 12. Edit task timing

> Give an option to edit the timing for each task
> (Screenshot of floral agenda list with times)

**Outcome:** Tap a task’s time to open a floral “Set bloom time” picker; save updates that item’s schedule.

## 13. Time tap marks done

> Clicking on the green time only mark the task done

**Outcome:** Time and done controls separated — tap underlined green time to edit; petal checkbox marks done.

## 14. Completed tasks summary

> When the user accesses the home page, he can click on a button to see a summary of all the task he completed

**Outcome:** Home CTA opens a floral completed-tasks summary of done agenda items.

## 15. Due-soon notifications

> When the user is not in the app, send her a notification 10 minutes before a task is due.

**Outcome:** Local due reminders via `expo-notifications` (10 min before), suppressed while the app is foregrounded.

## 16. Reminder lead time

> Change your 1min

**Outcome:** Due reminders now fire 1 minute before each task (was 10).

## 17. Timezone mode

> Make the app configurable for the tomzelne utc or local

**Outcome:** Home toggle switches agenda display/edit between Local time and UTC; reminders still use absolute stored times.

## 18. Cloud env + iOS notifications

> With our current dev workflow where the server runs in cursor cloud env, will the notification work on my ios app?

**Outcome:** Clarified: yes for local scheduled notifications once the phone loads the app and grants permission; Metro/tunnel is only needed to schedule, not to deliver.

## 19. Resend Expo Go link

> Resend expo go link

**Outcome:** Regenerated and shared the Expo Go launcher URL.


