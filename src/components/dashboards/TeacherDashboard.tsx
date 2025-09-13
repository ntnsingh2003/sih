import React, { useState } from 'react';
import Layout from '../common/Layout';
import StatCard from '../common/StatCard';
import RiskBadge from '../common/RiskBadge';
import { 
  Users, 
  AlertTriangle, 
  TrendingDown, 
  BookOpen,
  Download,
  Filter,
  Search,
  Eye,
  Mail
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Student {
  id: string;
  name: string;
  email: string;
  riskLevel: 'high' | 'medium' | 'low';
  attendance: number;
  grade: number;
  lastActive: string;
}

const TeacherDashboard: React.FC = () => {
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const students: Student[] = [
    { id: '1', name: 'Rahul Sharma', email: 'rahul@email.com', riskLevel: 'high', attendance: 65, grade: 72, lastActive: '2 days ago' },
    { id: '2', name: 'Priya Patel', email: 'priya@email.com', riskLevel: 'medium', attendance: 78, grade: 85, lastActive: '1 day ago' },
    { id: '3', name: 'Amit Kumar', email: 'amit@email.com', riskLevel: 'low', attendance: 92, grade: 88, lastActive: '1 hour ago' },
    { id: '4', name: 'Sneha Singh', email: 'sneha@email.com', riskLevel: 'high', attendance: 58, grade: 65, lastActive: '3 days ago' },
    { id: '5', name: 'Vikram Joshi', email: 'vikram@email.com', riskLevel: 'medium', attendance: 82, grade: 79, lastActive: '5 hours ago' },
    { id: '6', name: 'Anita Gupta', email: 'anita@email.com', riskLevel: 'low', attendance: 95, grade: 92, lastActive: '30 mins ago' },
  ];

  const classPerformanceData = [
    { month: 'Jan', average: 78, attendance: 85 },
    { month: 'Feb', average: 82, attendance: 87 },
    { month: 'Mar', average: 75, attendance: 82 },
    { month: 'Apr', average: 80, attendance: 84 },
    { month: 'May', average: 78, attendance: 80 },
    { month: 'Jun', average: 83, attendance: 86 },
  ];

  const riskDistributionData = [
    { risk: 'High Risk', count: 2, color: '#ef4444' },
    { risk: 'Medium Risk', count: 2, color: '#f59e0b' },
    { risk: 'Low Risk', count: 2, color: '#10b981' },
  ];

  const filteredStudents = students.filter(student => {
    const matchesRisk = filterRisk === 'all' || student.riskLevel === filterRisk;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const highRiskCount = students.filter(s => s.riskLevel === 'high').length;
  const mediumRiskCount = students.filter(s => s.riskLevel === 'medium').length;
  const averageAttendance = Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length);

  const exportData = () => {
    // Create CSV content
    const csvContent = [
      ['Name', 'Email', 'Risk Level', 'Attendance %', 'Grade %', 'Last Active'].join(','),
      ...filteredStudents.map(student => [
        student.name,
        student.email,
        student.riskLevel,
        student.attendance,
        student.grade,
        student.lastActive
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'students_report.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Teacher Dashboard">
      <div className="space-y-8">
        {/* Alert for At-Risk Students */}
        {highRiskCount > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {highRiskCount} Student{highRiskCount > 1 ? 's' : ''} at High Risk
                </h3>
                <p className="text-gray-600">
                  These students need immediate attention and intervention.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={students.length}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="High Risk Students"
            value={highRiskCount}
            icon={AlertTriangle}
            color="red"
            change={{
              value: highRiskCount > 0 ? 'Needs attention' : 'All students safe',
              type: highRiskCount > 0 ? 'decrease' : 'increase'
            }}
          />
          <StatCard
            title="Class Average Attendance"
            value={`${averageAttendance}%`}
            icon={TrendingDown}
            color={averageAttendance >= 80 ? 'green' : 'yellow'}
            change={{
              value: '+2.3% from last month',
              type: 'increase'
            }}
          />
          <StatCard
            title="Active Courses"
            value="6"
            icon={BookOpen}
            color="purple"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Performance Trend */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={classPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={3} name="Average Grade" />
                <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} name="Attendance Rate" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={riskDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="risk" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {riskDistributionData.map((entry, index) => (
                    <Bar key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900">Student List</h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value as any)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                  </select>
                </div>

                {/* Export Button */}
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RiskBadge risk={student.riskLevel} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${
                              student.attendance >= 80 ? 'bg-green-500' :
                              student.attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${student.attendance}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">{student.attendance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.grade}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                        <Mail className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;