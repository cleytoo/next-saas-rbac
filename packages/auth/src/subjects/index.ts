import { z } from 'zod'

import { billingSubject } from './billing'
import { inviteSubject } from './invite'
import { organizationSubject } from './organization'
import { projectSubject } from './project'
import { userSubject } from './user'

export const appAbilitiesSchema = z.union([
  projectSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,

  z.tuple([z.literal('manage'), z.literal('all')]),
])
