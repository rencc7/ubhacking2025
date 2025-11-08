// Cloudflare Pages configuration for Next.js
// Note: Cloudflare Pages requires special configuration for Next.js
// Consider using Cloudflare Pages with Next.js runtime or Cloudflare Workers

export default {
  build: {
    command: "npm run build",
    cwd: ".",
    watchPaths: ["**/*"],
  },
  functions: {
    "app/api/**/*.ts": {
      includeFiles: "**/*",
    },
  },
};

