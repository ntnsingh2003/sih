import React, { useState } from 'react';
import Layout from '../common/Layout';
import StatCard from '../common/StatCard';
import RiskBadge from '../common/RiskBadge';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Settings,
  Bell,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'counselor' | 'admin';
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface Alert {
  id: string;
  message: string;
  type: 'high' | 'medium' | 'low';
  timestamp: string;
  acknowledged: boolean;
}

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'alerts' | 'reports'>('overview');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@admin.com', role: 'admin', status: 'active', lastLogin: '2024-01-15' },
    { id: '2', name: 'Sarah Wilson', email: 'sarah@teacher.com', role: 'teacher', status: 'active', lastLogin: '2024-01-15' },
    { id: '3', name: 'Mike Chen', email: 'mike@counselor.com', role: 'counselor', status: 'active', lastLogin: '2024-01-14' },
    { id: '4', name: 'Rahul Sharma', email: 'rahul@student.com', role: 'student', status: 'active', lastLogin: '2024-01-13' },
    { id: '5', name: 'Priya Patel', email: 'priya@student.com', role: 'student', status: 'inactive', lastLogin: '2024-01-10' },
  ];

  const alerts: Alert[] = [
    { id: '1', message: 'Student Rahul Sharma has high dropout risk - immediate intervention needed', type: 'high', timestamp: '2024-01-15 09:30', acknowledged: false },
    { id: '2', message: 'Class average attendance dropped below 80%', type: 'medium', timestamp: '2024-01-15 08:15', acknowledged: false },
    { id: '3', message: 'System backup completed successfully', type: 'low', timestamp: '2024-01-15 07:00', acknowledged: true },
    { id: '4', message: 'New counselor Sarah Johnson registered', type: 'low', timestamp: '2024-01-14 16:45', acknowledged: true },
  ];

  const institutionData = [
    { month: 'Jan', enrollment: 450, dropouts: 12, retention: 97.3 },
    { month: 'Feb', enrollment: 448, dropouts: 8, retention: 98.2 },
    { month: 'Mar', enrollment: 452, dropouts: 15, retention: 96.7 },
    { month: 'Apr', enrollment: 455, dropouts: 10, retention: 97.8 },
    { month: 'May', enrollment: 458, dropouts: 7, retention: 98.5 },
    { month: 'Jun', enrollment: 461, dropouts: 9, retention: 98.0 },
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 320, color: '#10b981' },
    { name: 'Medium Risk', value: 95, color: '#f59e0b' },
    { name: 'High Risk', value: 46, color: '#ef4444' },
  ];

  const departmentPerformance = [
    { department: 'Computer Science', students: 120, riskPercentage: 8 },
    { department: 'Electronics', students: 95, riskPercentage: 12 },
    { department: 'Mechanical', students: 110, riskPercentage: 15 },
    { department: 'Civil', students: 85, riskPercentage: 10 },
    { department: 'Chemical', students: 51, riskPercentage: 18 },
  ];

  const totalStudents = users.filter(u => u.role === 'student').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const highRiskStudents = riskDistribution.find(r => r.name === 'High Risk')?.value || 0;
  const retentionRate = institutionData[institutionData.length - 1]?.retention || 0;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'counselor': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    console.log(`Acknowledged alert: ${alertId}`);
  };

  const exportReport = () => {
    const reportData = [
      ['Department', 'Total Students', 'High Risk', 'Risk Percentage'],
      ...departmentPerformance.map(dept => [
        dept.department,
        dept.students.toString(),
        Math.round(dept.students * dept.riskPercentage / 100).toString(),
        `${dept.riskPercentage}%`
      ])
    ];

    const csvContent = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'institution_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          color="blue"
          change={{
            value: '+12 new enrollments',
            type: 'increase'
          }}
        />
        <StatCard
          title="High Risk Students"
          value={highRiskStudents}
          icon={AlertTriangle}
          color="red"
          change={{
            value: '-3 from last month',
            type: 'increase'
          }}
        />
        <StatCard
          title="Retention Rate"
          value={`${retentionRate}%`}
          icon={TrendingUp}
          color="green"
          change={{
            value: '+0.8% improvement',
            type: 'increase'
          }}
        />
        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={GraduationCap}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Institution Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Institution Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={institutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="enrollment" stroke="#3b82f6" strokeWidth={3} name="Total Enrollment" />
              <Line type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={3} name="Retention Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#3b82f6" name="Total Students" />
            <Bar dataKey="riskPercentage" fill="#ef4444" name="Risk Percentage" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastLogin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type)} ${alert.acknowledged ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <RiskBadge risk={alert.type as any} size="sm" />
                  <span className="text-sm text-gray-500">{alert.timestamp}</span>
                </div>
                <p className="text-gray-900">{alert.message}</p>
              </div>
              {!alert.acknowledged && (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-all"
                >
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Reports</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
          <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h4 className="font-medium text-gray-900 mb-2">Student Performance Report</h4>
          <p className="text-sm text-gray-600 mb-4">Detailed analysis of student grades and performance</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h4 className="font-medium text-gray-900 mb-2">Risk Assessment Report</h4>
          <p className="text-sm text-gray-600 mb-4">Analysis of students at risk of dropping out</p>
          <button className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
          <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h4 className="font-medium text-gray-900 mb-2">Retention Analysis</h4>
          <p className="text-sm text-gray-600 mb-4">Institutional retention rates and trends</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'alerts', label: 'Alerts', icon: Bell },
              { key: 'reports', label: 'Reports', icon: Download },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'users' && renderUsers()}
        {selectedTab === 'alerts' && renderAlerts()}
        {selectedTab === 'reports' && renderReports()}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="counselor">Counselor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;