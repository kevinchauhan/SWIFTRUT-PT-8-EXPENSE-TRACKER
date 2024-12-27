import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import useAuthStore from '../store/authStore';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

const Dashboard = () => {
    const { user } = useAuthStore();
    const [expenses, setExpenses] = useState([]);
    const [categoryChartData, setCategoryChartData] = useState(null);
    const [timeChartData, setTimeChartData] = useState(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/expenses`, {
                    withCredentials: true
                });
                setExpenses(response.data.expenses);
                prepareCategoryChartData(response.data.expenses);
                prepareTimeChartData(response.data.expenses);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        const prepareCategoryChartData = (data) => {
            const categories = [...new Set(data.map((expense) => expense.category))];
            const categoryTotals = categories.map((category) =>
                data
                    .filter((expense) => expense.category === category)
                    .reduce((sum, expense) => sum + expense.amount, 0)
            );

            setCategoryChartData({
                labels: categories,
                datasets: [
                    {
                        data: categoryTotals,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                    },
                ],
            });
        };

        const prepareTimeChartData = (data) => {
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            const expensesByMonth = Array(12).fill(0);

            data.forEach((expense) => {
                const date = new Date(expense.date);
                const monthIndex = date.getMonth();
                expensesByMonth[monthIndex] += expense.amount;
            });

            setTimeChartData({
                labels: months,
                datasets: [
                    {
                        label: 'Expenses Over Time',
                        data: expensesByMonth,
                        borderColor: '#36A2EB',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                    },
                ],
            });
        };

        fetchExpenses();
    }, [user]);

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Expense Dashboard</h2>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Expense Breakdown by Category</h3>
                {categoryChartData ? (
                    <div className="w-full md:w-1/2 lg:1/3 mx-auto">
                        <Pie data={categoryChartData} />
                    </div>
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Expenses Over Time (Monthly)</h3>
                {timeChartData ? (
                    <div className="w-full">
                        <Line data={timeChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
