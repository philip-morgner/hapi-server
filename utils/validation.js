import Boom from "boom";

const failAction = async (request, h, err) => {
  if (err) {
    throw Boom.badRequest(`ValidationError: ${err.message}`);
  }
};
