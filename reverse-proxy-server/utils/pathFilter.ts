export const shouldTrackPath = (path: string): boolean => {
  const assetExtensions = [
    ".js",
    ".css",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".map",
  ];

  return !assetExtensions.some((ext) => path.endsWith(ext));
};
