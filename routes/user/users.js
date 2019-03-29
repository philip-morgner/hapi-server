import { getUserList } from "../../middleware/user";

exports.plugin = {
  name: "users",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/api/users",
      handler: async (request, h) => {
        const users = await getUserList();

        return h
          .response(users)
          .type("application/json")
          .code(200);
      }
    });
  }
};
