/**
 * Format Expo Go / tunnel URLs so chat and browsers can auto-link them.
 */

function hostWithoutPort(host) {
  if (!host) {
    return '';
  }
  // IPv6 in brackets is unlikely here; Expo reports host[:port].
  const [hostname] = host.split(':');
  return hostname || '';
}

function isLocalHost(host) {
  const hostname = hostWithoutPort(host).toLowerCase();
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '::1'
  );
}

function isTunnelHost(host) {
  const hostname = hostWithoutPort(host).toLowerCase();
  return hostname.endsWith('.exp.direct');
}

/**
 * Shareable + clickable: Expo tunnel hosts only. Loopback/LAN are not
 * auto-linked in chat and usually cannot reach a Cloud Agent from a phone.
 */
function isShareableHost(host) {
  if (!host || typeof host !== 'string') {
    return false;
  }
  return isTunnelHost(host) && !isLocalHost(host);
}

function formatExpoGoUrl(host) {
  return `exp://${host}`;
}

/**
 * HTTPS for *.exp.direct is clickable in Cursor/GitHub/Slack and serves the
 * same Metro tunnel as exp://.
 */
function formatClickableUrl(host) {
  if (!isTunnelHost(host)) {
    throw new Error(`Expected an *.exp.direct tunnel host, got: ${host}`);
  }
  return `https://${host}`;
}

function formatExpoUrls(host) {
  if (!isShareableHost(host)) {
    throw new Error(`Host is not a clickable tunnel URL yet: ${host}`);
  }

  const clickableUrl = formatClickableUrl(host);
  const expoGoUrl = formatExpoGoUrl(host);

  return {
    host,
    clickableUrl,
    expoGoUrl,
    primaryUrl: clickableUrl,
  };
}

module.exports = {
  formatClickableUrl,
  formatExpoGoUrl,
  formatExpoUrls,
  isLocalHost,
  isShareableHost,
  isTunnelHost,
};
