export function ttlToMs(ttl: APP.TTL): number {
  const match = ttl.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid TTL format: ${ttl}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }
}

// bikin Date expiry dari TTL
export function ttlToDate(ttl: APP.TTL, from: Date = new Date()): Date {
  return new Date(from.getTime() + ttlToMs(ttl));
}
