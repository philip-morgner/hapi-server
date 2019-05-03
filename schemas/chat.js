import Joi from "joi";

export const chatMessageSchema = Joi.object().keys({
  message: Joi.string()
    .min(1)
    .max(40)
    .required(),
  sender_id: Joi.string(),
  receiver_id: Joi.string()
});
