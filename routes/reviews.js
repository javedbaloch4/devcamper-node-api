import express from "express"
import { 
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
 } from "../controllers/reviews.js"
import advancedResults from "../middleware/advancedResults.js"
import { protect, authorize } from "../middleware/auth.js" 
import Reivew from "../models/Reivew.js"

const router = express.Router({ mergeParams: true })


router
    .route('/')
    .get(advancedResults(Reivew, {
        path: 'bootcamp',
        select: 'name description'
    }),getReviews)
    .post(protect, authorize('user','admin'), createReview)

router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('user','admin'), updateReview)
    .delete(protect, authorize('user','admin'), deleteReview)

export default router