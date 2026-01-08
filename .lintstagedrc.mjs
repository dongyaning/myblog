// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // Lint and fix TypeScript/JavaScript files
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // Format other files with Prettier
  '*.{json,md,mdx,css,html,yml,yaml}': ['prettier --write'],
}
