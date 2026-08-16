const {
  formatClickableUrl,
  formatExpoGoUrl,
  formatExpoUrls,
  isLocalHost,
  isShareableHost,
  isTunnelHost,
} = require('../scripts/formatExpoUrl');

describe('formatExpoUrl', () => {
  const tunnelHost = '9r9uaby-anonymous-8081.exp.direct';

  it('treats loopback hosts as local / not shareable', () => {
    expect(isLocalHost('127.0.0.1:8081')).toBe(true);
    expect(isLocalHost('localhost')).toBe(true);
    expect(isShareableHost('127.0.0.1:8081')).toBe(false);
  });

  it('does not treat LAN hosts as clickable share targets', () => {
    expect(isShareableHost('192.168.1.20:8081')).toBe(false);
  });

  it('recognizes Expo tunnel hosts', () => {
    expect(isTunnelHost(tunnelHost)).toBe(true);
    expect(isShareableHost(tunnelHost)).toBe(true);
  });

  it('builds a clickable Expo Go launcher URL (not the raw manifest root)', () => {
    expect(formatClickableUrl(tunnelHost)).toBe(
      `https://${tunnelHost}/_expo/link?platform=ios`,
    );
    expect(formatClickableUrl(tunnelHost)).not.toBe(`https://${tunnelHost}`);
  });

  it('still builds the classic exp:// deep link', () => {
    expect(formatExpoGoUrl(tunnelHost)).toBe(`exp://${tunnelHost}`);
  });

  it('returns the launcher https URL as the primary shareable link', () => {
    const urls = formatExpoUrls(tunnelHost);
    expect(urls.primaryUrl).toBe(
      `https://${tunnelHost}/_expo/link?platform=ios`,
    );
    expect(urls.clickableUrl).toBe(
      `https://${tunnelHost}/_expo/link?platform=ios`,
    );
    expect(urls.expoGoUrl).toBe(`exp://${tunnelHost}`);
  });

  it('rejects localhost so callers keep waiting for a tunnel', () => {
    expect(() => formatExpoUrls('127.0.0.1:8081')).toThrow(/clickable tunnel/i);
  });
});
