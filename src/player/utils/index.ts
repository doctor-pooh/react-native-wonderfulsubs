export const prettyTime = duration =>
  new Date(1000 * duration)
    .toISOString()
    .substr(11, 8)
    .replace(/^(00:0)|^(00:)/, "");