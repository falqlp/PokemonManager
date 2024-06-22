module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: [
    "application/**/*.ts",
    "websocket/**/*.ts",
    "domain/**/*.ts",
    "utils/**/*.ts",
  ],
};
