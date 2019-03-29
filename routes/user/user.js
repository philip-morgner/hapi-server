import { getUser } from "../../middleware/user";

exports.plugin = {
  name: "user",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/api/users/{user_id}",
      handler: async (request, h) => {
        const { user_id } = request.params;
        const user = await getUser(user_id);

        return h
          .response(user)
          .type("application/json")
          .code(200);
      }
    });
  }
};
