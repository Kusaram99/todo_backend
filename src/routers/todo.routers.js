import { Router } from 'express';
import { addTodo, deleteTodo, updateTodo, getUserTodos } from '../controllers/todos.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/add-todo').post(verifyJWT, addTodo);
router.route('/delete-todo/:_id').delete(verifyJWT, deleteTodo);
router.route('/update-todo').patch(verifyJWT, updateTodo);
router.route('/get-user-data/:_id').get(verifyJWT, getUserTodos);

export default router;