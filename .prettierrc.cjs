module.exports = {
  plugins: [
    require("@trivago/prettier-plugin-sort-imports"),
    "./node_modules/prettier-plugin-multiline-arrays",
    require("prettier-plugin-packagejson"),
  ],
  "semi": true,
  "tabWidth": 2,
  "printWidth": 120,
  "singleQuote": false,
  "trailingComma": "all",
  "jsxBracketSameLine": false,
  "endOfLine": "auto",
  "importOrder": ["^[./]", "<THIRD_PARTY_MODULES>"],
  "importOrderSeparation": false,
  "importOrderSortSpecifiers": true,
  "importOrderGroupNamespaceSpecifiers": true,
  "importOrderCaseInsensitive": true,
}
