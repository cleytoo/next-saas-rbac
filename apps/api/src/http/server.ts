import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { env } from '@saas/env'
import { fastify } from 'fastify'
import * as fz from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authenticateWithGithub } from './routes/auth/auth-with-github'
import { authenticateWithPassword } from './routes/auth/auth-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecovery } from './routes/auth/password-recovery'
import { resetPassword } from './routes/auth/reset-password'
import { setupSwagger } from './setup-swagger'

const app = fastify().withTypeProvider<fz.ZodTypeProvider>()

app.setSerializerCompiler(fz.serializerCompiler)
app.setValidatorCompiler(fz.validatorCompiler)

app.setErrorHandler(errorHandler)

setupSwagger(app)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(getProfile)
app.register(requestPasswordRecovery)
app.register(resetPassword)

app
  .listen({ port: env.SERVER_PORT })
  .then(() => console.log(`⚡ server on ${env.SERVER_PORT} ⚡`))
