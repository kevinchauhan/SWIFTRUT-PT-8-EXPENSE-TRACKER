import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const AddExpense = () => {
    const { user } = useAuthStore();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!description) newErrors.description = 'Description is required.';
        if (!amount || amount <= 0) newErrors.amount = 'Amount must be greater than 0.';
        if (!date) newErrors.date = 'Date is required.';
        if (!category) newErrors.category = 'Category is required.';
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
            await axios.post(
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
            toast.success('Expense added successfully!');
            setDescription('');
            setAmount('');
            setDate('');
            setCategory('');
            setPaymentMethod('cash');
            setErrors({});
        } catch (error) {
            toast.error('Failed to add expense. Please try again.');
            console.error('Error adding expense:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit}>
                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        placeholder="Enter expense description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
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
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
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
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
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
                    Add Expense
                </button>
            </form>
        </div>
    );
};

export default AddExpense;
