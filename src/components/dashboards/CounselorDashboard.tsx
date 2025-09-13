import React, { useState } from 'react';
import Layout from '../common/Layout';
import StatCard from '../common/StatCard';
import RiskBadge from '../common/RiskBadge';
import Chatbot from '../common/Chatbot';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Plus, 
  FileText, 
  Lightbulb,
  TrendingUp,
  Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CounselingSession {
  id: string;
  studentName: string;
  date: string;
  type: 'academic' | 'career' | 'mental-health' | 'personal';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface StudentProfile {
  id: string;
  name: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: string[];
  lastSession: string;
  totalSessions: number;
  improvementScore: number;
}

const CounselorDashboard: React.FC = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');

  const sessions: CounselingSession[] = [
    { id: '1', studentName: 'Rahul Sharma', date: '2024-01-15 10:00', type: 'mental-health', status: 'scheduled' },
    { id: '2', studentName: 'Priya Patel', date: '2024-01-15 14:00', type: 'career', status: 'completed', notes: 'Discussed career paths in IT sector.' },
    { id: '3', studentName: 'Amit Kumar', date: '2024-01-16 11:00', type: 'academic', status: 'scheduled' },
    { id: '4', studentName: 'Sneha Singh', date: '2024-01-16 15:00', type: 'personal', status: 'scheduled' },
  ];

  const students: StudentProfile[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      riskLevel: 'high',
      riskFactors: ['Low Attendance', 'Financial Issues', 'Mental Health'],
      lastSession: '2024-01-10',
      totalSessions: 5,
      improvementScore: 65
    },
    {
      id: '2',
      name: 'Priya Patel',
      riskLevel: 'medium',
      riskFactors: ['Study Stress', 'Time Management'],
      lastSession: '2024-01-12',
      totalSessions: 3,
      improvementScore: 78
    },
    {
      id: '3',
      name: 'Sneha Singh',
      riskLevel: 'high',
      riskFactors: ['Poor Grades', 'Family Issues', 'Low Motivation'],
      lastSession: '2024-01-08',
      totalSessions: 7,
      improvementScore: 58
    }
  ];

  const sessionTypeData = [
    { type: 'Academic', count: 15, color: '#3b82f6' },
    { type: 'Career', count: 12, color: '#10b981' },
    { type: 'Mental Health', count: 8, color: '#f59e0b' },
    { type: 'Personal', count: 6, color: '#8b5cf6' },
  ];

  const monthlyTrendsData = [
    { month: 'Jan', sessions: 18, improvements: 12 },
    { month: 'Feb', sessions: 22, improvements: 16 },
    { month: 'Mar', sessions: 19, improvements: 14 },
    { month: 'Apr', sessions: 25, improvements: 18 },
    { month: 'May', sessions: 21, improvements: 15 },
    { month: 'Jun', sessions: 28, improvements: 22 },
  ];

  const riskFactorDistribution = [
    { factor: 'Academic Issues', count: 25 },
    { factor: 'Mental Health', count: 18 },
    { factor: 'Financial Problems', count: 12 },
    { factor: 'Family Issues', count: 15 },
    { factor: 'Social Issues', count: 8 },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'career': return 'bg-green-100 text-green-800';
      case 'mental-health': return 'bg-yellow-100 text-yellow-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addCounselingNote = () => {
    if (selectedStudent && newNote.trim()) {
      console.log(`Adding note for student ${selectedStudent}: ${newNote}`);
      setNewNote('');
      setSelectedStudent(null);
    }
  };

  return (
    <Layout title="Counselor Dashboard">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={students.length}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="This Month's Sessions"
            value="28"
            icon={MessageSquare}
            color="green"
            change={{
              value: '+12% from last month',
              type: 'increase'
            }}
          />
          <StatCard
            title="Improvement Rate"
            value="78%"
            icon={TrendingUp}
            color="purple"
            change={{
              value: '+5% improvement',
              type: 'increase'
            }}
          />
          <StatCard
            title="Upcoming Sessions"
            value={sessions.filter(s => s.status === 'scheduled').length}
            icon={Calendar}
            color="yellow"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Types Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sessionTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {sessionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#3b82f6" name="Total Sessions" />
                <Bar dataKey="improvements" fill="#10b981" name="Improvements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Students at Risk */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Students Requiring Attention</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <RiskBadge risk={student.riskLevel} size="sm" />
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Last Session: {student.lastSession}</p>
                    <p>Total Sessions: {student.totalSessions}</p>
                    <div className="flex items-center">
                      <span>Progress:</span>
                      <div className="ml-2 flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${student.improvementScore}%` }}
                        />
                      </div>
                      <span className="ml-2">{student.improvementScore}%</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Risk Factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.riskFactors.map((factor, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedStudent(student.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-all"
                    >
                      Add Note
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded hover:bg-gray-200 transition-all">
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
              <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Schedule Session</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {session.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(session.type)}`}>
                        {session.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                        {session.status.replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Trends</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Mental health sessions increased by 23% this month</li>
                <li>• Students with financial issues show 40% higher dropout risk</li>
                <li>• Early intervention reduces risk by average of 35%</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recommended Actions</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Schedule follow-up with Rahul Sharma within 3 days</li>
                <li>• Implement group therapy sessions for anxiety</li>
                <li>• Connect high-risk students with financial aid resources</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Counseling Note</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student: {students.find(s => s.id === selectedStudent)?.name}
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your counseling notes here..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addCounselingNote}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
              >
                Save Note
              </button>
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setNewNote('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!chatbotOpen && (
        <button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 pulse"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chatbot */}
      <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </Layout>
  );
};

export default CounselorDashboard;