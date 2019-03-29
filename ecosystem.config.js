module.exports = {
  apps: [
    {
      name: "REST API",
      script: "bootstrap.js",
      instances: 1,
      exec_mode: "cluster",
      watch: ["./database", "./middleware", "./routes", "./schemas", "./utils"],
      ignore_watch: ["node_modules", "./public"],
      watch_options: {
        followSymlinks: false
      }
    }
  ]
};
