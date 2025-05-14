import { env } from '@saas/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors'

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with Github',
        body: z.object({
          code: z.string(),
        }),
        response: {
          200: z.object({ token: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const githubOauthURL = new URL(
        'https://github.com/login/oauth/access_token',
      )
      githubOauthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
      githubOauthURL.searchParams.set(
        'client_secret',
        env.GITHUB_OAUTH_CLIENT_SECRET,
      )
      githubOauthURL.searchParams.set(
        'redirect_uri',
        env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
      )
      githubOauthURL.searchParams.set('code', code)

      const githubAccessRawData = await fetch(githubOauthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const githubAccessParseData = await githubAccessRawData.json()

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .parse(githubAccessParseData)

      const userRawData = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      })

      const userParseData = await userRawData.json()

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          id: z.number().int().transform(String),
          name: z.string().nullable(),
          email: z.string().email().nullable(),
          avatar_url: z.string().url(),
        })
        .parse(userParseData)

      if (!email) {
        throw new BadRequestError(
          'Your Github account must have email to authenticate!',
        )
      }

      let user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: githubId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign({ sub: user.id }, { expiresIn: '7d' })

      return reply.status(200).send({ token })
    },
  )
}

// https://github.com/login/oauth/authorize?client_id=Ov23liLFLaZTTEtWooDs&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email
