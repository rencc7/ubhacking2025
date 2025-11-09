// Function to parse duration string to seconds
export function parseDurationToSeconds(duration: string | undefined): number | undefined {
  if (!duration) return undefined;

  const match = duration.toLowerCase().match(/(\d+)\s*(minute|min|hour|hr|second|sec)s?/);
  if (!match) return undefined;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch(unit) {
    case 'hour':
    case 'hr':
      return value * 3600;
    case 'minute':
    case 'min':
      return value * 60;
    case 'second':
    case 'sec':
      return value;
    default:
      return undefined;
  }
}