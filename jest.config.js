const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testMatch: ["**/?(*.)+(spec).ts"],
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "html", "js", "json"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: "<rootDir>/" }),
  transform: {
    "^.+\\.(ts|mjs|html|js)$": [
      "ts-jest",
      { tsconfig: "<rootDir>/tsconfig.app.json", stringifyContentPathRegex: "\\.html$" }
    ]
  }
};
