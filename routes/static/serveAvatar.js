"use strict";

import glob from "glob";
import { verifyUserExists } from "../../middleware/verification";
import { findFile } from "../../middleware/user";

const PUBLIC_DIR = "public/";

exports.plugin = {
  name: "avatar",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/api/users/{user_id}/avatar",
      config: {
        // pre: [{ method: verifyUserExists }],
        // access to "public"
        auth: false
      },
      handler: async (request, h) => {
        const { user_id } = request.params;
        const path = await findFile(user_id, PUBLIC_DIR);

        return h.file(path);
      }
    });
  }
};
