import {Router} from "express"
import * as control from '../controllers/user'
const router=Router()

router.route('/login').get(control.login)
router.route('/register').get(control.Register)
export default router