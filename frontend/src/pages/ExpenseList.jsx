import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const ExpenseList = () => {
    const { user } = useAuthStore();
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [sortOrder, setSortOrder] = useState('date');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/expenses`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                        params: {
                            page: currentPage,
                            sort: sortOrder,
                            search: searchQuery,
                        },
                    }
                );
                setExpenses(response.data.expenses);
                setTotalPages(response.data.totalPages);
                setFilteredExpenses(response.data.expenses);
            } catch (error) {
                toast.error('Error fetching expenses');
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, [user, currentPage, sortOrder, searchQuery]);

    const handleSort = (field) => {
        setSortOrder(field);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Expenses</h2>

            {/* Search Bar */}
            <div className="flex items-center mb-6">
                <input
                    type="text"
                    placeholder="Search by description"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
            </div>

            {/* Sort Options */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => handleSort('date')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Sort by Date
                </button>
                <button
                    onClick={() => handleSort('amount')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Sort by Amount
                </button>
                <button
                    onClick={() => handleSort('category')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Sort by Category
                </button>
            </div>

            {/* Expense Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="px-6 py-3 text-left text-sm font-medium">Description</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Amount</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Category</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Payment Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((expense) => (
                            <tr
                                key={expense._id}
                                className="border-b hover:bg-gray-50 text-gray-800"
                            >
                                <td className="px-6 py-4">{expense.description}</td>
                                <td className="px-6 py-4">${expense.amount}</td>
                                <td className="px-6 py-4">{expense.date}</td>
                                <td className="px-6 py-4">{expense.category}</td>
                                <td className="px-6 py-4">{expense.paymentMethod}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${currentPage === 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                >
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${currentPage === totalPages
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ExpenseList;
