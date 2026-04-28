import { authHandlers } from './handlers/auth'
import { productHandlers } from './handlers/product'
import { reportHandlers } from './handlers/report'
import { reviewHandlers } from './handlers/review'
import { receiptHandlers } from './handlers/receipt'
import { userHandlers } from './handlers/user'
import { groupHandlers } from './handlers/group'

export const handlers = [
  ...authHandlers,
  ...productHandlers,
  ...reportHandlers,
  ...reviewHandlers,
  ...receiptHandlers,
  ...userHandlers,
  ...groupHandlers,
]
