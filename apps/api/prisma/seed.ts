import { fa, faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const password = await hash('102030', 1)

  const [user, rdUser, fkUser] = await prisma.user.createManyAndReturn({
    data: [
      {
        name: 'John doe',
        email: 'johndoe@acme.com',
        avatarUrl: '',
        passwordHash: password,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash: password,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash: password,
      },
    ],
  })

  // admin
  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatar(),
      bindUsersByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                rdUser.id,
                fkUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                rdUser.id,
                fkUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                rdUser.id,
                fkUser.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'ADMIN' },
            { userId: rdUser.id, role: 'MEMBER' },
            { userId: fkUser.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })

  // member
  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatar(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                rdUser.id,
                fkUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                rdUser.id,
                fkUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                rdUser.id,
                fkUser.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'MEMBER' },
            { userId: rdUser.id, role: 'ADMIN' },
            { userId: fkUser.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })

  // billing
  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatar(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                rdUser.id,
                fkUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                rdUser.id,
                fkUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                rdUser.id,
                fkUser.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'BILLING' },
            { userId: rdUser.id, role: 'ADMIN' },
            { userId: fkUser.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })
}

seed().then(() => console.log('Database seeded!'))
