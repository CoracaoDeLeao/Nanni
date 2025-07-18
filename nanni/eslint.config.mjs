import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Regras personalizadas
  {
    rules: {
      // Exemplo: alerta se usar console.log
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Exemplo: proibir var, usar let/const
      "no-var": "error",

      // Exemplo: forçar uso de ponto e vírgula
      "semi": ["error", "always"],

      // Exemplo: usar aspas duplas para strings
      "quotes": ["error", "double"],

      // Exemplo: forçar arrow functions para funções anônimas
      "prefer-arrow-callback": "error",

      // Exemplo: desabilitar regra de prop types (útil com TS)
      "react/prop-types": "off",

      // Exemplo: permitir importações relativas sem extensão
      "import/extensions": ["error", "ignorePackages", {
        ts: "never",
        tsx: "never",
        js: "never",
        jsx: "never"
      }],
    }
  }
];

export default eslintConfig;
