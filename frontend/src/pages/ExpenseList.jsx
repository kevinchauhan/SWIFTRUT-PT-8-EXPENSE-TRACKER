import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const { user } = useAuthStore(); // Get user from store

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/expenses`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setExpenses(response.data.expenses);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, [user]);

    return (
        <div>
            <h2>Your Expenses</h2>
            <button onClick={() => window.location.href = '/add-expense'}>Add Expense</button>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Payment Method</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense._id}>
                            <td>{expense.description}</td>
                            <td>{expense.amount}</td>
                            <td>{expense.date}</td>
                            <td>{expense.category}</td>
                            <td>{expense.paymentMethod}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseList;
