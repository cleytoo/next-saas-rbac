import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastify } from 'fastify'
import * as fz from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authenticateWithPassword } from './routes/auth/auth-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { setupSwagger } from './setup-swagger'

const app = fastify().withTypeProvider<fz.ZodTypeProvider>()

app.setSerializerCompiler(fz.serializerCompiler)
app.setValidatorCompiler(fz.validatorCompiler)

app.setErrorHandler(errorHandler)

setupSwagger(app)

app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
})

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)

app.listen({ port: 3333 }).then(() => console.log('Server running on :3333!'))
