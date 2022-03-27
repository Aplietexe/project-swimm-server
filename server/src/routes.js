import { Router } from "express"

const router = Router()

router.get("/temperatures", (_, res) => {
  res.sendStatus(200)
})

export default router
