// commitlint.config.mjs
/** @type {import("@commitlint/types").UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 可以在这里自定义规则，例如：
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore", "revert"],
    ],
  },
};

/*
常用的 Type 说明：
feat: 新功能
fix: 修复 Bug
docs: 文档变更
style: 代码格式（不影响逻辑，如空格、分号）
refactor: 代码重构（无新功能或 Bug 修复）
chore: 构建过程或辅助工具的变动
*/

export default config;
