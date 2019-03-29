"use strict";

import Hapi from "hapi";
import Path from "path";
import { concat } from "ramda";

import pkg from "./package";
import { validateUser } from "./middleware/user";

const server = Hapi.server({
  port: 4000,
  host: "localhost"
  // routes: {
  //   files: {
  //     relativeTo: Path.join(__dirname, "public")
  //   }
  // }
});

const routes = [
  ...require("./routes/login"),
  ...require("./routes/user"),
  ...require("./routes/message"),
  ...require("./routes/static")
];

const init = async () => {
  await server.register(require("hapi-auth-jwt2"));
  await server.register(require("inert"));

  server.auth.strategy("jwt", "jwt", {
    key: pkg.privateKey, // Never Share your secret key
    validate: validateUser,
    verifyOptions: { algorithms: ["HS256"] } // pick a strong algorithm
  });

  server.auth.default("jwt");

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
