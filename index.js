"use strict";

import Hapi from "hapi";
import Path from "path";

import pkg from "./package";
import { validateUser } from "./middleware/user";

const server = Hapi.server({
  host: "0.0.0.0",
  port: process.env.PORT || 4000,
  routes: {
    cors: {
      origin: ["*"]
    }
  }
});

const routes = [
  ...require("./routes/login"),
  ...require("./routes/user"),
  ...require("./routes/message"),
  ...require("./routes/static")
];

const init = async () => {
  // websocket
  await server.register(require("hapi-plugin-websocket"));
  // auth
  await server.register(require("hapi-auth-jwt2"));
  // static file/ directory handler
  await server.register(require("inert"));

  server.auth.strategy("jwt", "jwt", {
    key: pkg.privateKey, // Never Share your secret key
    validate: validateUser,
    verifyOptions: { algorithms: ["HS256"] } // pick a strong algorithm
  });

  server.auth.default("jwt");

  // does nothing
  server.event("chat");
  server.events.on("chat", message => console.log("ciao", message));

  await server.register(routes);

  await server.start();

  return server;
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init()
  .then(server => console.log(`Server running at: ${server.info.uri}`))
  .catch(error => console.error(`Unable to start the server: ${error}`));
