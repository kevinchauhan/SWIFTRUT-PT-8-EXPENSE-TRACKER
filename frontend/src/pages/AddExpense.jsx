import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const AddExpense = () => {
    const { user } = useAuthStore();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/expenses`,
                {
                    description,
                    amount,
                    date,
                    category,
                    paymentMethod,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            alert('Expense added successfully');
        } catch (error) {
            setError('Error adding expense');
            console.error('Error adding expense:', error);
        }
    };

    return (
        <div>
            <h2>Add New Expense</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="cash">Cash</option>
                    <option value="credit">Credit</option>
                </select>
                <button type="submit">Add Expense</button>
            </form>
        </div>
    );
};

export default AddExpense;
