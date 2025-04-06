import fastifyCors from '@fastify/cors'
import { fastify } from 'fastify'
import * as fz from 'fastify-type-provider-zod'

import { createAccount } from './routes/auth/create-account'

const app = fastify().withTypeProvider<fz.ZodTypeProvider>()

app.setSerializerCompiler(fz.serializerCompiler)
app.setValidatorCompiler(fz.validatorCompiler)

app.register(fastifyCors)

app.register(createAccount)

app.listen({ port: 3333 }).then(() => console.log('Server running on :3333!'))
