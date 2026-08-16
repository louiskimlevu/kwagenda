#!/usr/bin/env bash
# Start Expo tunnel (if needed) and print an Expo Go URL.
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

echo "Waiting for tunnel URL…"
HOST=""
for _ in $(seq 1 90); do
  if HOST="$(fetch_host)"; then
    if [[ -n "$HOST" ]]; then
      break
    fi
  fi
  if [[ "$STARTED_BY_SCRIPT" -eq 1 ]] && ! kill -0 "$EXPO_PID" 2>/dev/null; then
    echo "Expo process exited early. Last log lines:"
    tail -n 40 "${ROOT}/.expo/expo-tunnel.log" || true
    exit 1
  fi
  sleep 1
done

if [[ -z "${HOST}" ]]; then
  echo "Timed out waiting for an Expo tunnel URL."
  if [[ -f "${ROOT}/.expo/expo-tunnel.log" ]]; then
    echo "Last log lines:"
    tail -n 40 "${ROOT}/.expo/expo-tunnel.log"
  fi
  exit 1
fi

EXP_URL="exp://${HOST}"
mkdir -p "$(dirname "$OUT_FILE")"
printf '%s\n' "$EXP_URL" >"$OUT_FILE"

echo ""
echo "Expo Go URL"
echo "-----------"
echo "$EXP_URL"
echo ""
echo "Also saved to: ${OUT_FILE}"
echo "Paste into Expo Go → Enter URL, or open on iOS Camera / Safari."
