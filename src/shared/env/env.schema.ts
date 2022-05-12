import * as Joi from 'joi'

export const schema = Joi.object({
  PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  SENTRY_DSN: Joi.string().required(),
  // THROTTLE_TTL_SEC: Joi.number().required(),
  // THROTTLE_LIMIT: Joi.number().required(),
  CARD_CONTRACT_ADDRESS: Joi.string().required(),
  PROVIDER_API_HTTP: Joi.string().required(),
})
