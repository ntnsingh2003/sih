# DropFixer: AI-based Dropout Prediction & Counseling System

An advanced full-stack web application that uses AI to predict student dropout risks and provides comprehensive counseling support through multiple dashboards and a multilingual chatbot.

## 🌟 Features

### 🔐 Authentication & Role Management
- **Role-based Access Control**: Student, Teacher, Counselor, Admin
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Automatic token refresh and secure logout

### 🤖 AI-Powered Predictions
- **XGBoost Model**: Machine learning dropout risk prediction
- **SHAP Explanations**: Interpretable AI with feature importance
- **Real-time Risk Assessment**: Continuous monitoring and alerts
- **Risk Categories**: High, Medium, Low risk classification

### 📊 Comprehensive Dashboards

#### Student Dashboard
- Personal risk status and recommendations
- Attendance and grade tracking
- Interactive surveys and assessments
- Direct access to AI counselor chatbot
- Progress visualization with charts

#### Teacher Dashboard
- Class performance overview
- Student risk monitoring
- Attendance and grade analytics
- Export functionality for reports
- Individual student profiles

#### Counselor Dashboard
- Student counseling management
- Session scheduling and notes
- Risk factor analysis
- AI-powered insights and recommendations
- Progress tracking for interventions

#### Admin Dashboard
- Institution-wide analytics
- User management (CRUD operations)
- System alerts and notifications
- Comprehensive reporting system
- Department performance metrics

### 🗣️ Multilingual AI Chatbot
- **Languages**: English and Hindi support
- **Voice Integration**: Speech-to-text input and text-to-speech output
- **Counseling Categories**: Academic, Career, Mental Health, Personal
- **Context-Aware Responses**: Smart conversation handling
- **Real-time Communication**: Instant response system

### 📈 Advanced Analytics
- **Interactive Charts**: Using Recharts for data visualization
- **Trend Analysis**: Historical performance tracking
- **Risk Distribution**: Visual risk factor analysis
- **Department Metrics**: Institution-level insights
- **Export Capabilities**: CSV and PDF report generation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API communication
- **JWT Decode** for token management

### Backend
- **Flask** (Python web framework)
- **PostgreSQL** with SQLAlchemy ORM
- **XGBoost** for machine learning
- **Flask-JWT-Extended** for authentication
- **CORS** support for cross-origin requests

### AI/ML Components
- **XGBoost Classifier** for dropout prediction
- **NumPy & Pandas** for data processing
- **Scikit-learn** for model utilities
- **SHAP-like explanations** for interpretability

### Database Schema
- **Users**: Authentication and role management
- **Attendance**: Student attendance tracking
- **Grades**: Academic performance records
- **Fees**: Financial status monitoring
- **Surveys**: Student feedback and assessments
- **Alerts**: Risk-based notification system

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- PostgreSQL 12+

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
export DATABASE_URL="postgresql://localhost:5432/dropfixer_db"
export JWT_SECRET_KEY="your-secret-key-here"

# Seed the database with demo data
python seed_data.py

# Start the Flask server
python app.py
```

### Database Setup
```bash
# Create PostgreSQL database
createdb dropfixer_db

# The application will automatically create tables on first run
```

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@demo.com | demo123 |
| Teacher | teacher@demo.com | demo123 |
| Counselor | counselor@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

## 📊 AI Model Details

### Prediction Features
- Attendance percentage
- Average grades
- Fee payment status
- Family support level
- Study hours per day
- Extracurricular participation
- Mental health score
- Financial difficulty level

### Risk Assessment
- **High Risk (>70%)**: Immediate intervention needed
- **Medium Risk (40-70%)**: Close monitoring required  
- **Low Risk (<40%)**: Standard support sufficient

### Model Performance
- Built on synthetic data for demonstration
- Real implementation would use historical student data
- Continuous learning capability for model improvement

## 🎯 Key Innovations

### 1. Comprehensive Risk Analysis
- Multi-factor risk assessment combining academic, financial, and personal factors
- Real-time alert system for immediate intervention
- Predictive analytics with actionable insights

### 2. Role-Based Dashboards
- Tailored interfaces for different user types
- Appropriate data access and functionality per role
- Seamless workflow integration

### 3. Multilingual Support
- English and Hindi language support
- Cultural sensitivity in counseling approaches
- Voice-enabled interaction for accessibility

### 4. Data-Driven Insights
- Interactive visualizations for better understanding
- Export capabilities for further analysis
- Trend identification and pattern recognition

## 🔒 Security Features

- JWT-based authentication with secure token management
- Role-based access control (RBAC)
- SQL injection prevention through ORM
- CORS protection for API endpoints
- Password hashing with Werkzeug security

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Optimized for tablets and desktop
- Touch-friendly interface elements
- Progressive Web App capabilities

## 🚦 Development Status

### ✅ Completed Features
- Full authentication system
- All dashboard implementations
- AI prediction engine
- Multilingual chatbot
- Database integration
- Mock data generation

### 🔄 Future Enhancements
- Email/SMS notification system
- Advanced ML model with real data
- Mobile app development
- Integration with existing LMS
- Advanced reporting features

## 📄 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user info

### Prediction Endpoints
- `POST /predict/{student_id}` - Get dropout risk prediction
- `GET /explain/{student_id}` - Get SHAP explanations

### Data Endpoints
- `GET /students` - List students (role-restricted)
- `GET /alerts` - Get system alerts
- `POST /alerts/{id}/acknowledge` - Acknowledge alert

### Chatbot Endpoint
- `POST /chat` - Handle chatbot conversations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For technical support or questions about DropFixer, please contact the development team or create an issue in the repository.

## 📜 License

This project is licensed under the MIT License. See LICENSE file for details.

---

**DropFixer** - Empowering educational institutions with AI-driven student success insights."# sih" 
