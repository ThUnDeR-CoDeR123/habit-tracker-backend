module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 30000,
  maxWorkers: 1, // Run tests sequentially to avoid connection conflicts
  forceExit: true, // Force exit after tests complete
};
