import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError, UnauthorizedError } from '../_errors'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get authenticate user profile.',
        response: {
          200: z.object({
            user: z.object({
              id: z.string().cuid(),
              email: z.string().email(),
              name: z.string().nullable(),
              avatarUrl: z.string().url().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub } = await request.jwtVerify<{ sub: string }>().catch(() => {
        throw new UnauthorizedError()
      })

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
        where: { id: sub },
      })

      if (!user) throw new BadRequestError('User not found.')

      return reply.send({ user })
    },
  )
}
