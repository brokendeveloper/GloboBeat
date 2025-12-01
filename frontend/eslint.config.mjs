import { createRequire } from "module";

const require = createRequire(import.meta.url);
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

const config = [
  ...nextCoreWebVitals,
  {
    ignores: ["node_modules/**"],
  },
];

export default config;
