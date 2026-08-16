#!/usr/bin/env bash
# Start Expo tunnel (if needed) and print a clickable Expo Go URL.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${EXPO_PORT:-8081}"
MANIFEST_URL="http://127.0.0.1:${PORT}"
OUT_FILE="${ROOT}/.expo/expo-go-url.txt"
STARTED_BY_SCRIPT=0
EXPO_PID=""

cleanup_note() {
  if [[ "$STARTED_BY_SCRIPT" -eq 1 && -n "$EXPO_PID" ]]; then
    echo ""
    echo "Metro/tunnel is still running (pid ${EXPO_PID})."
    echo "Stop it with: kill ${EXPO_PID}"
  fi
}

fetch_host() {
  curl -fsS "$MANIFEST_URL" 2>/dev/null | python3 -c '
import json, sys
try:
    data = json.load(sys.stdin)
    host = (
        data.get("extra", {})
        .get("expoClient", {})
        .get("hostUri")
        or data.get("extra", {})
        .get("expoGo", {})
        .get("debuggerHost")
    )
    if host:
        print(host)
except Exception:
    sys.exit(1)
' 2>/dev/null
}

metro_up() {
  curl -fsS "$MANIFEST_URL/status" >/dev/null 2>&1
}

format_urls() {
  local host="$1"
  node -e '
const { formatExpoUrls, isShareableHost } = require("./scripts/formatExpoUrl");
const host = process.argv[1];
if (!isShareableHost(host)) process.exit(2);
const urls = formatExpoUrls(host);
process.stdout.write(JSON.stringify(urls));
' "$host"
}

if metro_up; then
  echo "Expo already running on port ${PORT}."
else
  echo "Starting Expo tunnel on port ${PORT}…"
  mkdir -p "${ROOT}/.expo"
  # Detach so this script can poll for the URL.
  npx expo start --tunnel --port "$PORT" >"${ROOT}/.expo/expo-tunnel.log" 2>&1 &
  EXPO_PID=$!
  STARTED_BY_SCRIPT=1
  trap cleanup_note EXIT
fi

echo "Waiting for a clickable tunnel URL…"
HOST=""
URLS_JSON=""
for _ in $(seq 1 90); do
  if HOST="$(fetch_host)"; then
    if [[ -n "$HOST" ]]; then
      if URLS_JSON="$(format_urls "$HOST")"; then
        break
      fi
      # Loopback / LAN fallback from Metro — keep waiting for *.exp.direct.
      HOST=""
      URLS_JSON=""
    fi
  fi
  if [[ "$STARTED_BY_SCRIPT" -eq 1 ]] && ! kill -0 "$EXPO_PID" 2>/dev/null; then
    echo "Expo process exited early. Last log lines:"
    tail -n 40 "${ROOT}/.expo/expo-tunnel.log" || true
    exit 1
  fi
  sleep 1
done

if [[ -z "${HOST}" || -z "${URLS_JSON}" ]]; then
  echo "Timed out waiting for a clickable Expo tunnel URL."
  if [[ -f "${ROOT}/.expo/expo-tunnel.log" ]]; then
    echo "Last log lines:"
    tail -n 40 "${ROOT}/.expo/expo-tunnel.log"
  fi
  exit 1
fi

CLICKABLE_URL="$(python3 -c 'import json,sys; print(json.load(sys.stdin)["clickableUrl"])' <<<"$URLS_JSON")"
EXP_URL="$(python3 -c 'import json,sys; print(json.load(sys.stdin)["expoGoUrl"])' <<<"$URLS_JSON")"
PRIMARY_URL="$(python3 -c 'import json,sys; print(json.load(sys.stdin)["primaryUrl"])' <<<"$URLS_JSON")"

mkdir -p "$(dirname "$OUT_FILE")"
{
  printf '%s\n' "$PRIMARY_URL"
  printf '%s\n' "$EXP_URL"
} >"$OUT_FILE"

echo ""
echo "Expo Go URL (clickable)"
echo "-----------------------"
echo "$CLICKABLE_URL"
echo ""
echo "Expo Go deep link (paste fallback)"
echo "----------------------------------"
echo "$EXP_URL"
echo ""
echo "Also saved to: ${OUT_FILE}"
echo "Tap the https link on your phone, or paste the exp:// URL in Expo Go → Enter URL."
