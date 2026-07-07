const CONNECT_PATTERN = /^moodsyncui:\/\/connect\/([a-zA-Z0-9_]{3,20})$/;

export function buildConnectPayload(handle: string): string {
  return `moodsyncui://connect/${handle}`;
}

export function parseConnectPayload(data: string): string | null {
  const match = CONNECT_PATTERN.exec(data.trim());
  return match ? match[1] : null;
}
