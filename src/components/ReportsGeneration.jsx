import React, { useState } from 'react';
import {
    Download,
    FileText,
    Users,
    Package,
    TrendingUp,
    ArrowLeft,
    Filter,
    Search
} from 'lucide-react';

const ReportsGeneration = ({ onBack }) => {
    const [reportConfig, setReportConfig] = useState({
        type: 'users',
        format: 'csv',
        dateRange: 'last30',
        filters: {
            userType: 'all',
            donationStatus: 'all',
            includeStats: true
        }
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const reportTypes = [
        {
            id: 'users',
            name: 'Users Report',
            description: 'Export user data including donors, receivers, and admins',
            icon: Users,
            fields: ['ID', 'Name', 'Email', 'Type', 'Registration Date', 'Status']
        },
        {
            id: 'donations',
            name: 'Donations Report',
            description: 'Export donation data with status and details',
            icon: Package,
            fields: ['ID', 'Title', 'Category', 'Donor', 'Status', 'Created Date', 'Expiry Date']
        },
        {
            id: 'statistics',
            name: 'Statistics Report',
            description: 'Generate comprehensive system statistics',
            icon: TrendingUp,
            fields: ['Total Users', 'Active Donations', 'Completed Donations', 'Success Rate']
        },
        {
            id: 'custom',
            name: 'Custom Report',
            description: 'Create a custom report with specific filters',
            icon: Filter,
            fields: ['Customizable based on selected criteria']
        }
    ];

    const handleGenerateReport = async () => {
        setIsGenerating(true);

        try {
            // Simulate API call to generate report
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In a real implementation, this would:
            // 1. Call the backend API with reportConfig
            // 2. Generate the report file
            // 3. Download the file

            const mockData = generateMockData(reportConfig.type);
            const filename = `${reportConfig.type}_report_${new Date().toISOString().split('T')[0]}.${reportConfig.format}`;

            if (reportConfig.format === 'csv') {
                downloadCSV(mockData, filename);
            } else {
                downloadPDF(mockData, filename);
            }

            // Show success message
            alert(`${reportConfig.type.charAt(0).toUpperCase() + reportConfig.type.slice(1)} report generated successfully!`);

        } catch (error) {
            console.error('Error generating report:', error);
            alert('Error generating report. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateMockData = (type) => {
        switch (type) {
            case 'users':
                return [
                    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'donor', registrationDate: '2024-01-15', status: 'active' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'receiver', registrationDate: '2024-02-20', status: 'active' },
                    { id: 3, name: 'Admin User', email: 'admin@example.com', type: 'admin', registrationDate: '2024-01-01', status: 'active' }
                ];
            case 'donations':
                return [
                    { id: 1, title: 'Fresh Vegetables', category: 'Produce', donor: 'John Doe', status: 'available', createdDate: '2024-03-01', expiryDate: '2024-03-05' },
                    { id: 2, title: 'Canned Goods', category: 'Non-perishable', donor: 'Jane Smith', status: 'completed', createdDate: '2024-02-28', expiryDate: '2024-12-31' }
                ];
            case 'statistics':
                return {
                    totalUsers: 150,
                    totalDonors: 85,
                    totalReceivers: 60,
                    totalAdmins: 5,
                    totalDonations: 245,
                    availableDonations: 78,
                    completedDonations: 145,
                    expiredDonations: 22,
                    successRate: '85.2%'
                };
            default:
                return [];
        }
    };

    const downloadCSV = (data, filename) => {
        let csvContent = '';

        if (Array.isArray(data)) {
            if (data.length > 0) {
                // Add headers
                csvContent += Object.keys(data[0]).join(',') + '\n';

                // Add data rows
                data.forEach(row => {
                    csvContent += Object.values(row).join(',') + '\n';
                });
            }
        } else {
            // For statistics object
            csvContent += 'Metric,Value\n';
            Object.entries(data).forEach(([key, value]) => {
                csvContent += `${key},${value}\n`;
            });
        }

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const downloadPDF = (data, filename) => {
        // For a real implementation, you would use a library like jsPDF
        // For now, we'll create a simple text file as a placeholder
        let content = `${reportConfig.type.toUpperCase()} REPORT\n`;
        content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                content += `Record ${index + 1}:\n`;
                Object.entries(item).forEach(([key, value]) => {
                    content += `  ${key}: ${value}\n`;
                });
                content += '\n';
            });
        } else {
            Object.entries(data).forEach(([key, value]) => {
                content += `${key}: ${value}\n`;
            });
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.replace('.pdf', '.txt'); // Use .txt for this demo
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredReportTypes = reportTypes.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={onBack}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </button>
                <div className="flex items-center">
                    <FileText className="h-6 w-6 text-gray-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-900">Reports Generation</h1>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReportTypes.map((reportType) => {
                    const IconComponent = reportType.icon;
                    return (
                        <div
                            key={reportType.id}
                            className={`p-6 rounded-lg cursor-pointer transition-all ${reportConfig.type === reportType.id
                                    ? 'bg-blue-50 border-2 border-blue-600'
                                    : 'bg-white border border-gray-300 hover:border-blue-400'
                                }`}
                            onClick={() => setReportConfig({ ...reportConfig, type: reportType.id })}
                        >
                            <div className="flex items-start">
                                <IconComponent className="h-8 w-8 text-blue-600 mr-4 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{reportType.name}</h3>
                                    <p className="text-gray-600 mt-1">{reportType.description}</p>
                                    <div className="mt-4">
                                        <p className="text-xs font-medium text-gray-500">Fields:</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {reportType.fields.map((field, index) => (
                                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                    {field}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {reportConfig.type === reportType.id && (
                                    <div className="ml-4">
                                        <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Configuration */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                        <select
                            value={reportConfig.format}
                            onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="csv">CSV</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <select
                            value={reportConfig.dateRange}
                            onChange={(e) => setReportConfig({ ...reportConfig, dateRange: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Time</option>
                            <option value="last30">Last 30 Days</option>
                            <option value="last90">Last 90 Days</option>
                            <option value="lastyear">Last Year</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <Download className="h-5 w-5 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                </button>
            </div>
        </div>
    );
};

export default ReportsGeneration;
