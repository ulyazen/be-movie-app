const router = require('express').Router()
const expressPlayground =
  require('graphql-playground-middleware-express').default

router.get('/', expressPlayground({ endpoint: '/graphql' }))

export default router
