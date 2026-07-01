export const generatePath = (
  template: string,
  params: Record<string, string | number>,
): string =>
  template.replace(/:(\w+)/g, (_, key: string) =>
    encodeURIComponent(params[key]),
  );
