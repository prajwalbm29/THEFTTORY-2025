import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiUsers, FiCheckCircle, FiClock, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import RecentComplaints from '../components/RecentComplaints';
//import ComplaintChart from '../components/ComplaintChart';

const Home = () => {
    const [stats, setStats] = useState({
        totalComplaints: 0,
        activeOfficers: 0,
        resolvedCases: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);

                // Call all three endpoints concurrently
                const [totalRes, activeRes, resolvedRes] = await Promise.all([
                    axios.get('/api/v1/admin/total-complaints'),
                    axios.get('/api/v1/admin/active-officers'),
                    axios.get('/api/v1/admin/resolved-cases'),
                ]);

                setStats({
                    totalComplaints: totalRes?.data?.totalComplaints || 0,
                    activeOfficers: activeRes?.data?.activeOfficers || 0,
                    resolvedCases: resolvedRes?.data?.resolvedCases || 0,
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);


    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen p-6 text-gray-800">
                <div className="max-w-7xl mx-auto">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="text-blue-600">Admin</span> 👮‍♂️</h1>
                            <p className="text-lg text-gray-600">
                                Here's what's happening with your department today.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Link
                                to="/admin/complaints/phone"
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                            >
                                <FiPlus className="mr-2" />
                                Check Complaints
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard
                            title="Total Complaints"
                            value={stats.totalComplaints}
                            icon={<FiAlertTriangle className="text-blue-500" size={24} />}
                            color="blue"
                            loading={isLoading}
                        />
                        <StatCard
                            title="Active Officers"
                            value={stats.activeOfficers}
                            icon={<FiUsers className="text-green-500" size={24} />}
                            color="green"
                            loading={isLoading}
                        />
                        <StatCard
                            title="Resolved Cases"
                            value={stats.resolvedCases}
                            icon={<FiCheckCircle className="text-purple-500" size={24} />}
                            color="purple"
                            loading={isLoading}
                        />
                    </div>

                    {/* Charts and Recent Activity Section */}
                    <div className="grid grid-cols-1 gap-6 mb-10">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Complaints Overview</h2>
                                <select className="bg-gray-100 border border-gray-200 rounded px-3 py-1 text-sm">
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                    <option>Last 90 days</option>
                                </select>
                            </div>
                            {/* <ComplaintChart /> */}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4">Recent Complaints</h2>
                            <RecentComplaints />
                            <Link to="/admin/complaints/phone" className="text-blue-600 text-sm font-medium mt-4 block text-right">
                                View all complaints →
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ActionCard
                                title="Manage Complaints"
                                description="View and verify public complaints"
                                link="/admin/complaints/phone"
                                icon="📋"
                                color="bg-blue-100 text-blue-600"
                            />
                            <ActionCard
                                title="Assign Cases"
                                description="Allocate complaints to officers"
                                link="/admin/assignment"
                                icon="👮"
                                color="bg-green-100 text-green-600"
                            />
                            <ActionCard
                                title="Manage Staff"
                                description="Add or remove officers"
                                link="/admin/polices"
                                icon="👥"
                                color="bg-purple-100 text-purple-600"
                            />
                            <ActionCard
                                title="Safety Updates"
                                description="Post safety tips"
                                link="/admin/general-safety"
                                icon="⚠️"
                                color="bg-yellow-100 text-yellow-600"
                            />
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4">System Status</h2>
                        <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-gray-600">All systems operational</span>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, loading }) => {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-100',
        yellow: 'bg-yellow-50 border-yellow-100',
        green: 'bg-green-50 border-green-100',
        purple: 'bg-purple-50 border-purple-100'
    };

    return (
        <div className={`p-6 rounded-xl border ${colorClasses[color]} transition hover:shadow-md`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 font-medium">{title}</p>
                    {loading ? (
                        <div className="h-8 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
                    ) : (
                        <p className="text-3xl font-bold mt-1">{value}</p>
                    )}
                </div>
                <div className="p-2 rounded-lg bg-white shadow-sm">
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Action Card Component
const ActionCard = ({ title, description, link, icon, color }) => {
    return (
        <Link to={link} className={`p-5 rounded-xl ${color} transition transform hover:scale-[1.02]`}>
            <div className="flex items-start">
                <span className="text-2xl mr-3">{icon}</span>
                <div>
                    <h3 className="font-bold text-lg mb-1">{title}</h3>
                    <p className="text-sm opacity-80">{description}</p>
                </div>
            </div>
        </Link>
    );
};

export default Home;