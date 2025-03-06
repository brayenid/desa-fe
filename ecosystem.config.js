module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'node',
      args: '.next/standalone/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
