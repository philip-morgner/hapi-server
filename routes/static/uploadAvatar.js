"use-strict";

import Boom from "boom";
import { uploadFile } from "../../middleware/user";
import { verifyUserExists, verifyImage } from "../../middleware/verification";
// import { addAvatar } from "../../middleware/user";

exports.plugin = {
  name: "upload",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/users/{user_id}/avatar",
      config: {
        pre: [
          { method: verifyUserExists },
          { method: verifyImage, assign: "imageType" }
        ],
        payload: {
          // 24MB
          maxBytes: 25165824,
          output: "stream"
        }
      },
      handler: async (req, h) => {
        const {
          params: { user_id },
          payload: { file },
          pre: { imageType }
        } = req;
        const response = await uploadFile(user_id, file, imageType);

        return response;
      }
    });
  }
};
