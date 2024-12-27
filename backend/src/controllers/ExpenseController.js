import Expense from '../models/Expense.js';

class ExpenseController {
    // Add a new expense
    async addExpense(req, res) {
        try {
            const { amount, description, date, category, paymentMethod } = req.body;

            const newExpense = new Expense({
                amount,
                description,
                date,
                category,
                paymentMethod,
            });

            await newExpense.save();
            res.status(201).json({ message: 'Expense added successfully', newExpense });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add expense', error });
        }
    }

    // Get all expenses with filtering, sorting, and pagination
    async getExpenses(req, res) {
        try {
            const { category, startDate, endDate, paymentMethod, sortBy, page = 1, limit = 10 } = req.query;

            const query = {};

            if (category) query.category = category;
            if (paymentMethod) query.paymentMethod = paymentMethod;
            if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

            const expenses = await Expense.find(query)
                .sort(sortBy || { date: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const totalExpenses = await Expense.countDocuments(query);

            res.status(200).json({
                expenses,
                totalPages: Math.ceil(totalExpenses / limit),
                currentPage: page,
                totalExpenses,
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch expenses', error });
        }
    }

    // Update an expense
    async updateExpense(req, res) {
        try {
            const { expenseId } = req.params;
            const updatedExpense = await Expense.findByIdAndUpdate(expenseId, req.body, {
                new: true,
                runValidators: true,
            });

            if (!updatedExpense) {
                return res.status(404).json({ message: 'Expense not found' });
            }

            res.status(200).json({ message: 'Expense updated successfully', updatedExpense });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update expense', error });
        }
    }

    // Delete an expense
    async deleteExpense(req, res) {
        try {
            const { expenseId } = req.params;
            const deletedExpense = await Expense.findByIdAndDelete(expenseId);

            if (!deletedExpense) {
                return res.status(404).json({ message: 'Expense not found' });
            }

            res.status(200).json({ message: 'Expense deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete expense', error });
        }
    }

    // Bulk delete expenses
    async bulkDeleteExpenses(req, res) {
        try {
            const { ids } = req.body; // Expects an array of expense IDs

            const result = await Expense.deleteMany({ _id: { $in: ids } });

            res.status(200).json({ message: `${result.deletedCount} expenses deleted successfully` });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete expenses', error });
        }
    }

    // Get an expense by its ID
    async getExpenseById(req, res) {
        try {
            const { expenseId } = req.params;

            // Find the expense by its ID
            const expense = await Expense.findById(expenseId);

            if (!expense) {
                return res.status(404).json({ message: 'Expense not found' });
            }

            res.status(200).json(expense);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch expense', error });
        }
    }

}

export default ExpenseController;
