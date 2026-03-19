import canvaPlugin from "@canva/app-eslint-plugin";

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/dist",
      "**/*.d.ts",
      "**/*.d.tsx",
      "**/*.config.*",
    ],
  },
  ...canvaPlugin.configs.apps,
  {
    rules: {
      // We use explicit message IDs for maintainability
      "formatjs/no-id": "off",
    },
  },
];
