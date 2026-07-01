export const indicesOf = (text: string, needle: string): number[] =>
  Array.from(
    text.matchAll(
      new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') || '(?!)', 'g'),
    ),
    ({ index }) => index,
  );
