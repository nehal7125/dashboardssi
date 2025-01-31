module.exports = {
    apps: [
      {
        name: "vite-app",
        script: "npx",
        args: "vite preview --port 3000",
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  }
  