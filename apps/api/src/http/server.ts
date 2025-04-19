import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import * as fz from 'fastify-type-provider-zod'

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

app.register(fastifyCors)

app.register(createAccount)

app.listen({ port: 3333 }).then(() => console.log('Server running on :3333!'))
