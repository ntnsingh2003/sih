import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import StatCard from '../common/StatCard';
import RiskBadge from '../common/RiskBadge';
import Chatbot from '../common/Chatbot';
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface StudentData {
  riskLevel: 'high' | 'medium' | 'low';
  attendance: number;
  grades: number;
  assignments: number;
  upcomingDeadlines: number;
}

const StudentDashboard: React.FC = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [studentData, setStudentData] = useState<StudentData>({
    riskLevel: 'medium',
    attendance: 78,
    grades: 85,
    assignments: 12,
    upcomingDeadlines: 3
  });

  const attendanceData = [
    { month: 'Jan', attendance: 90 },
    { month: 'Feb', attendance: 85 },
    { month: 'Mar', attendance: 78 },
    { month: 'Apr', attendance: 82 },
    { month: 'May', attendance: 75 },
    { month: 'Jun', attendance: 80 },
  ];

  const gradeDistribution = [
    { subject: 'Mathematics', grade: 85, color: '#3b82f6' },
    { subject: 'Physics', grade: 78, color: '#10b981' },
    { subject: 'Chemistry', grade: 92, color: '#f59e0b' },
    { subject: 'English', grade: 88, color: '#8b5cf6' },
  ];

  const riskFactors = [
    { name: 'Low Attendance', value: 35, color: '#ef4444' },
    { name: 'Poor Grades', value: 20, color: '#f97316' },
    { name: 'Financial Issues', value: 25, color: '#eab308' },
    { name: 'Other Factors', value: 20, color: '#6b7280' },
  ];

  const surveys = [
    { title: 'Academic Satisfaction Survey', completed: false, dueDate: '2024-01-15' },
    { title: 'Mental Health Check-in', completed: true, dueDate: '2024-01-10' },
    { title: 'Career Interests Assessment', completed: false, dueDate: '2024-01-20' },
  ];

  return (
    <Layout title="Student Dashboard">
      <div className="space-y-8">
        {/* Risk Status Alert */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your Current Status</h3>
                <p className="text-gray-600">Based on our AI analysis of your academic data</p>
              </div>
            </div>
            <RiskBadge risk={studentData.riskLevel} size="lg" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Attendance Rate"
            value={`${studentData.attendance}%`}
            icon={Calendar}
            color={studentData.attendance >= 80 ? 'green' : 'red'}
            change={{
              value: studentData.attendance >= 80 ? '+2.5% from last month' : '-5.2% from last month',
              type: studentData.attendance >= 80 ? 'increase' : 'decrease'
            }}
          />
          <StatCard
            title="Average Grade"
            value={`${studentData.grades}%`}
            icon={TrendingUp}
            color={studentData.grades >= 80 ? 'green' : 'yellow'}
            change={{
              value: '+3.2% from last semester',
              type: 'increase'
            }}
          />
          <StatCard
            title="Pending Assignments"
            value={studentData.assignments}
            icon={BookOpen}
            color={studentData.assignments <= 5 ? 'green' : 'red'}
          />
          <StatCard
            title="Upcoming Deadlines"
            value={studentData.upcomingDeadlines}
            icon={Clock}
            color={studentData.upcomingDeadlines <= 2 ? 'green' : 'yellow'}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Factors */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factor Analysis</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskFactors}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskFactors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Surveys and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Surveys */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Surveys</h3>
            <div className="space-y-4">
              {surveys.map((survey, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {survey.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{survey.title}</p>
                      <p className="text-sm text-gray-600">Due: {survey.dueDate}</p>
                    </div>
                  </div>
                  {!survey.completed && (
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all">
                      Take Survey
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
            <div className="space-y-4">
              {gradeDistribution.map((subject, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${subject.grade}%`,
                          backgroundColor: subject.color
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{subject.grade}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center">
              <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Set Goals</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-center">
              <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">View Progress</p>
            </button>
            <button 
              onClick={() => setChatbotOpen(true)}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-center"
            >
              <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Get Counseling</p>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!chatbotOpen && (
        <button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 pulse"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chatbot */}
      <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </Layout>
  );
};

export default StudentDashboard;