import express from 'express';
import ExpenseController from '../controllers/ExpenseController.js';

const router = express.Router();

const expenseController = new ExpenseController();

router.post('/', expenseController.addExpense);
router.get('/', expenseController.getExpenses);
router.patch('/:expenseId', expenseController.updateExpense);
router.delete('/:expenseId', expenseController.deleteExpense);
router.delete('/bulk', expenseController.bulkDeleteExpenses);

export default router;
