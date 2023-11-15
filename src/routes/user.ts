import {Router} from "express"
import * as control from '../controllers/user'
const router=Router()

router.route('/login').get(control.login)
router.route('/register').get(control.Register)
router.route('/logout').post(control.logout)
router.route('/google').get(control.googleAuth)

export default router