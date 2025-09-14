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

interface ReportsGenerationProps {
    onBack: () => void;
}

interface ReportConfig {
    type: 'users' | 'donations' | 'statistics' | 'custom';
    format: 'csv' | 'pdf';
    dateRange: 'all' | 'last30' | 'last90' | 'lastyear' | 'custom';
    customStartDate?: string;
    customEndDate?: string;
    filters?: {
        userType?: 'all' | 'donors' | 'receivers' | 'admins';
        donationStatus?: 'all' | 'available' | 'completed' | 'expired';
        includeStats?: boolean;
    };
}

const ReportsGeneration: React.FC<ReportsGenerationProps> = ({ onBack }) => {
    const [reportConfig, setReportConfig] = useState<ReportConfig>({
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

    const generateMockData = (type: string) => {
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

    const downloadCSV = (data: any, filename: string) => {
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

    const downloadPDF = (data: any, filename: string) => {
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
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Generate Reports</h1>
                        <p className="text-gray-600">Export system data in CSV or PDF format</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Report Type Selection */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search report types..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Report Types */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Select Report Type</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredReportTypes.map((type) => {
                                const IconComponent = type.icon;
                                return (
                                    <div
                                        key={type.id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${reportConfig.type === type.id
                                                ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setReportConfig({ ...reportConfig, type: type.id as any })}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <IconComponent className={`w-6 h-6 mt-1 ${reportConfig.type === type.id ? 'text-green-600' : 'text-gray-400'
                                                }`} />
                                            <div className="flex-1">
                                                <h3 className={`font-medium ${reportConfig.type === type.id ? 'text-green-900' : 'text-gray-900'
                                                    }`}>
                                                    {type.name}
                                                </h3>
                                                <p className={`text-sm mt-1 ${reportConfig.type === type.id ? 'text-green-700' : 'text-gray-600'
                                                    }`}>
                                                    {type.description}
                                                </p>
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-500">Includes:</p>
                                                    <p className="text-xs text-gray-600">{type.fields.join(', ')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Configuration Panel */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h2>

                        {/* Format Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                                <select
                                    value={reportConfig.format}
                                    onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value as 'csv' | 'pdf' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="csv">CSV (Excel Compatible)</option>
                                    <option value="pdf">PDF Document</option>
                                </select>
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                <select
                                    value={reportConfig.dateRange}
                                    onChange={(e) => setReportConfig({ ...reportConfig, dateRange: e.target.value as any })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="all">All Time</option>
                                    <option value="last30">Last 30 Days</option>
                                    <option value="last90">Last 90 Days</option>
                                    <option value="lastyear">Last Year</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                            </div>

                            {/* Custom Date Range */}
                            {reportConfig.dateRange === 'custom' && (
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={reportConfig.customStartDate || ''}
                                            onChange={(e) => setReportConfig({ ...reportConfig, customStartDate: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={reportConfig.customEndDate || ''}
                                            onChange={(e) => setReportConfig({ ...reportConfig, customEndDate: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Filters */}
                            {(reportConfig.type === 'users' || reportConfig.type === 'donations' || reportConfig.type === 'custom') && (
                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700">Filters</h3>

                                    {(reportConfig.type === 'users' || reportConfig.type === 'custom') && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">User Type</label>
                                            <select
                                                value={reportConfig.filters?.userType || 'all'}
                                                onChange={(e) => setReportConfig({
                                                    ...reportConfig,
                                                    filters: { ...reportConfig.filters, userType: e.target.value as any }
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                <option value="all">All Users</option>
                                                <option value="donors">Donors Only</option>
                                                <option value="receivers">Receivers Only</option>
                                                <option value="admins">Admins Only</option>
                                            </select>
                                        </div>
                                    )}

                                    {(reportConfig.type === 'donations' || reportConfig.type === 'custom') && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Donation Status</label>
                                            <select
                                                value={reportConfig.filters?.donationStatus || 'all'}
                                                onChange={(e) => setReportConfig({
                                                    ...reportConfig,
                                                    filters: { ...reportConfig.filters, donationStatus: e.target.value as any }
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                <option value="all">All Donations</option>
                                                <option value="available">Available</option>
                                                <option value="completed">Completed</option>
                                                <option value="expired">Expired</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="includeStats"
                                            checked={reportConfig.filters?.includeStats || false}
                                            onChange={(e) => setReportConfig({
                                                ...reportConfig,
                                                filters: { ...reportConfig.filters, includeStats: e.target.checked }
                                            })}
                                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="includeStats" className="ml-2 text-xs text-gray-600">
                                            Include summary statistics
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                            className={`w-full mt-6 px-4 py-3 rounded-lg font-medium transition-colors ${isGenerating
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                } flex items-center justify-center space-x-2`}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>Generate Report</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Preview Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-blue-900">Report Preview</h3>
                                <p className="text-xs text-blue-700 mt-1">
                                    {reportConfig.type.charAt(0).toUpperCase() + reportConfig.type.slice(1)} report in {reportConfig.format.toUpperCase()} format
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Date range: {reportConfig.dateRange === 'all' ? 'All time' :
                                        reportConfig.dateRange === 'last30' ? 'Last 30 days' :
                                            reportConfig.dateRange === 'last90' ? 'Last 90 days' :
                                                reportConfig.dateRange === 'lastyear' ? 'Last year' : 'Custom range'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsGeneration;