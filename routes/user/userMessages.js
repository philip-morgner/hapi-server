import { getUserMessages } from "../../middleware/message";

exports.plugin = {
  name: "userMessages",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/api/users/{user_id}/messages",
      handler: async (request, h) => {
        const { user_id } = request.params;
        const userMessages = await getUserMessages(user_id);

        return h
          .response(userMessages)
          .type("application/json")
          .code(200);
      }
    });
  }
};
