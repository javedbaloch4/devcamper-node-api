import express from "express"

import {
    deleteUser,
    updateUser,
    getUser,
    getUsers,
    createUser
} from "../controllers/user.js"
import User from "../models/User.js"
import { protect, authorize } from "../middleware/auth.js"
import advancedResults from "../middleware/advancedResults.js"

const Router = express.Router({ mergeParams: true })

Router.use(protect)
Router.use(authorize('admin'))

Router
    .route('/')
    .get(advancedResults(User),getUsers)
    .post(createUser)

Router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)


export default Router