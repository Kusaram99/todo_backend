import { Router } from 'express';
import { addTodo } from '../controllers/todos.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';



const router = Router();

router.route('/add-todo').post(verifyJWT, addTodo);

export default router;