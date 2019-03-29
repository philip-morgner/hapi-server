"use strict";

exports.plugin = {
  name: "helloWorld",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/",
      config: {
        auth: false
      },
      handler: async (request, h) => {
        console.log("HELLO WORLD");

        return h
          .response("<h1>Hello World</h1>")
          .type("text/html")
          .code(200);
      }
    });
  }
};
