import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const EditExpense = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { id } = useParams(); // Get the expense ID from the URL
    const [expense, setExpense] = useState({
        description: '',
        amount: '',
        date: '',
        category: '',
        paymentMethod: 'cash',
    });
    const [errors, setErrors] = useState({});

    // Fetch the expense details by ID on mount
    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/expenses/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                setExpense(response.data); // Set the fetched expense details
            } catch (error) {
                toast.error('Error fetching expense details');
                console.error('Error fetching expense:', error);
            }
        };

        fetchExpense();
    }, [id, user.token]);

    const validateForm = () => {
        const newErrors = {};
        if (!expense.description) newErrors.description = 'Description is required.';
        if (!expense.amount || expense.amount <= 0) newErrors.amount = 'Amount must be greater than 0.';
        if (!expense.date) newErrors.date = 'Date is required.';
        if (!expense.category) newErrors.category = 'Category is required.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/expenses/${id}`,
                expense,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            toast.success('Expense updated successfully!');
            navigate('/expenses'); // Navigate back to the expense list page
        } catch (error) {
            toast.error('Failed to update expense. Please try again.');
            console.error('Error updating expense:', error);
        }
    };

    const handleChange = (e) => {
        setExpense({ ...expense, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Expense</h2>
            <form onSubmit={handleSubmit}>
                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={expense.description}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                </div>

                {/* Amount */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={expense.amount}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.amount ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                    )}
                </div>

                {/* Date */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={expense.date}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={expense.category}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select
                        name="paymentMethod"
                        value={expense.paymentMethod}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="cash">Cash</option>
                        <option value="credit">Credit</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                >
                    Update Expense
                </button>
            </form>
        </div>
    );
};

export default EditExpense;
