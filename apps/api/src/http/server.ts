import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import * as fz from 'fastify-type-provider-zod'

import { authenticateWithPassword } from './routes/auth/auth-with-password'
import { createAccount } from './routes/auth/create-account'

const app = fastify().withTypeProvider<fz.ZodTypeProvider>()

app.setSerializerCompiler(fz.serializerCompiler)
app.setValidatorCompiler(fz.validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js Saas API',
      description: 'Full stack saas app with multi-tenant & RBAC',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: fz.jsonSchemaTransform,
})
app.register(fastifySwaggerUI, { routePrefix: '/docs' })
app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
})
app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)

app.listen({ port: 3333 }).then(() => console.log('Server running on :3333!'))
