import { take, takeLast } from "ramda";
import { getMessageList } from "../../middleware/message";
import { messagesQuerySchema } from "../../schemas/message";

exports.plugin = {
  name: "messages",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/api/messages",
      options: {
        validate: {
          query: messagesQuerySchema
        }
      },
      handler: async (request, h) => {
        const { limit, last } = request.query;
        const messageList = await getMessageList();
        const messages = last
          ? takeLast(limit, messageList)
          : take(limit, messageList);

        return h
          .response(messages)
          .type("application/json")
          .code(200);
      }
    });
  }
};
