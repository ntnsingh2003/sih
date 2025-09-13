from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import xgboost as xgb
import pickle
import os
from typing import Dict, Any
import google.generativeai as genai

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///dropfixer.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Database Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('student', 'teacher', 'counselor', 'admin', name='user_roles'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class Attendance(db.Model):
    __tablename__ = 'attendance'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    month = db.Column(db.String(20), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Grades(db.Model):
    __tablename__ = 'grades'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Float, nullable=False)
    semester = db.Column(db.String(20), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Fees(db.Model):
    __tablename__ = 'fees'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.Enum('paid', 'pending', 'overdue', name='fee_status'), nullable=False)
    amount_due = db.Column(db.Float, nullable=False)
    amount_paid = db.Column(db.Float, default=0.0)
    due_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Surveys(db.Model):
    __tablename__ = 'surveys'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    responses = db.Column(db.JSON, nullable=False)
    survey_type = db.Column(db.String(50), nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class Alerts(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    risk_level = db.Column(db.Enum('high', 'medium', 'low', name='risk_levels'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    acknowledged = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ML Model class
class DropoutPredictor:
    def __init__(self):
        self.model = None
        self.feature_columns = [
            'attendance_percentage', 'average_grade', 'fee_status_encoded',
            'family_support', 'study_hours', 'extracurricular_activities',
            'mental_health_score', 'financial_difficulty'
        ]
    
    def load_model(self):
        """Load pre-trained model or create a mock one for demo"""
        try:
            with open('model/dropout_model.pkl', 'rb') as f:
                self.model = pickle.load(f)
        except FileNotFoundError:
            # Create a mock model for demo purposes
            self.model = self._create_mock_model()
    
    def _create_mock_model(self):
        """Create a mock XGBoost model for demonstration"""
        # Generate synthetic training data
        np.random.seed(42)
        n_samples = 1000
        
        X = np.random.randn(n_samples, len(self.feature_columns))
        # Create realistic relationships
        y = (X[:, 0] < -1) | (X[:, 1] < -1) | (X[:, 2] > 1) | (X[:, 6] < -1)  # Risk factors
        y = y.astype(int)
        
        model = xgb.XGBClassifier(random_state=42)
        model.fit(X, y)
        return model
    
    def predict_risk(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict dropout risk for a student"""
        if self.model is None:
            self.load_model()
        
        # Extract features
        features = self._extract_features(student_data)
        X = np.array([features])
        
        # Make prediction
        risk_prob = self.model.predict_proba(X)[0]
        risk_prediction = self.model.predict(X)[0]
        
        # Determine risk level
        high_risk_prob = risk_prob[1] if len(risk_prob) > 1 else 0
        if high_risk_prob > 0.7:
            risk_level = 'high'
        elif high_risk_prob > 0.4:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'risk_level': risk_level,
            'probability': float(high_risk_prob),
            'factors': self._get_risk_factors(features),
            'recommendations': self._get_recommendations(risk_level)
        }
    
    def _extract_features(self, student_data: Dict[str, Any]) -> list:
        """Extract features from student data"""
        # Default values for demo
        return [
            student_data.get('attendance_percentage', 80),
            student_data.get('average_grade', 75),
            1 if student_data.get('fee_status') == 'overdue' else 0,
            student_data.get('family_support', 3),
            student_data.get('study_hours', 4),
            student_data.get('extracurricular_activities', 2),
            student_data.get('mental_health_score', 3),
            student_data.get('financial_difficulty', 2)
        ]
    
    def _get_risk_factors(self, features: list) -> list:
        """Identify risk factors based on feature values"""
        risk_factors = []
        
        if features[0] < 75:  # attendance
            risk_factors.append("Low attendance rate")
        if features[1] < 70:  # grades
            risk_factors.append("Poor academic performance")
        if features[2] == 1:  # fees
            risk_factors.append("Outstanding fees")
        if features[3] < 2:  # family support
            risk_factors.append("Limited family support")
        if features[6] < 2:  # mental health
            risk_factors.append("Mental health concerns")
        if features[7] > 3:  # financial difficulty
            risk_factors.append("Financial difficulties")
        
        return risk_factors
    
    def _get_recommendations(self, risk_level: str) -> list:
        """Get recommendations based on risk level"""
        recommendations = {
            'high': [
                "Schedule immediate counseling session",
                "Contact family/guardians",
                "Provide additional academic support",
                "Refer to financial aid office"
            ],
            'medium': [
                "Monitor attendance closely",
                "Provide study support resources",
                "Schedule regular check-ins",
                "Consider peer mentoring"
            ],
            'low': [
                "Continue regular monitoring",
                "Encourage participation in activities",
                "Maintain good communication"
            ]
        }
        return recommendations.get(risk_level, [])

# Initialize ML model
predictor = DropoutPredictor()

# Configure Gemini AI
GEMINI_API_KEY = "AIzaSyC8wAxhzmsoePyzXVsmLdyNs-DDgz_uxWw"
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model
try:
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    gemini_available = True
    print("✅ Gemini AI initialized successfully!")
except Exception as e:
    print(f"❌ Gemini API not available: {e}")
    gemini_available = False

# Authentication routes
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if user and user.check_password(password):
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict())

# Prediction routes
@app.route('/predict/<int:student_id>', methods=['POST'])
@jwt_required()
def predict_dropout(student_id):
    """Predict dropout risk for a specific student"""
    try:
        student = User.query.get(student_id)
        if not student or student.role != 'student':
            return jsonify({'error': 'Student not found'}), 404
        
        # Gather student data
        attendance = db.session.query(Attendance).filter_by(student_id=student_id).order_by(Attendance.created_at.desc()).first()
        grades = db.session.query(Grades).filter_by(student_id=student_id).all()
        fees = db.session.query(Fees).filter_by(student_id=student_id).order_by(Fees.created_at.desc()).first()
        survey = db.session.query(Surveys).filter_by(student_id=student_id).order_by(Surveys.completed_at.desc()).first()
        
        # Prepare data for ML model
        student_data = {
            'attendance_percentage': attendance.percentage if attendance else 80,
            'average_grade': np.mean([g.score for g in grades]) if grades else 75,
            'fee_status': fees.status if fees else 'paid',
            'family_support': survey.responses.get('family_support', 3) if survey else 3,
            'study_hours': survey.responses.get('study_hours', 4) if survey else 4,
            'extracurricular_activities': survey.responses.get('extracurricular', 2) if survey else 2,
            'mental_health_score': survey.responses.get('mental_health', 3) if survey else 3,
            'financial_difficulty': survey.responses.get('financial_difficulty', 2) if survey else 2
        }
        
        # Make prediction
        prediction = predictor.predict_risk(student_data)
        
        # Create or update alert if high risk
        if prediction['risk_level'] == 'high':
            existing_alert = Alerts.query.filter_by(student_id=student_id, acknowledged=False).first()
            if not existing_alert:
                alert = Alerts(
                    student_id=student_id,
                    risk_level='high',
                    message=f"Student {student.name} is at high risk of dropping out. Immediate intervention recommended."
                )
                db.session.add(alert)
                db.session.commit()
        
        return jsonify({
            'student_id': student_id,
            'student_name': student.name,
            'prediction': prediction,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/explain/<int:student_id>', methods=['GET'])
@jwt_required()
def explain_prediction(student_id):
    """Provide SHAP-like explanations for predictions"""
    try:
        # Mock SHAP values for demo
        explanations = {
            'features': [
                {'name': 'Attendance', 'impact': -0.15, 'value': '65%'},
                {'name': 'Grades', 'impact': -0.12, 'value': '72%'},
                {'name': 'Fee Status', 'impact': 0.08, 'value': 'Overdue'},
                {'name': 'Family Support', 'impact': -0.05, 'value': 'Low'},
                {'name': 'Mental Health', 'impact': 0.03, 'value': 'Good'},
                {'name': 'Financial Difficulty', 'impact': 0.07, 'value': 'High'}
            ],
            'base_value': 0.3,
            'prediction': 0.75,
            'threshold': 0.5
        }
        
        return jsonify(explanations)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Chatbot routes
@app.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    """Handle chatbot conversations using Gemini AI"""
    data = request.get_json()
    message = data.get('message', '')
    language = data.get('language', 'en')
    
    try:
        if gemini_available and message.strip():
            # Create a context-aware prompt for the AI counselor
            if language == 'hi':
                prompt = f"""आप एक अनुभवी शैक्षिक परामर्शदाता हैं जो छात्रों की मदद करते हैं। आपको निम्नलिखित संदेश का उत्तर देना है:

संदेश: {message}

कृपया उपयोगी, सहानुभूतिपूर्ण और व्यावहारिक सलाह दें। यदि यह शैक्षणिक, करियर, या मानसिक स्वास्थ्य से संबंधित है तो विशिष्ट सुझाव दें। उत्तर हिंदी में दें और 200 शब्दों से कम रखें।"""
            else:
                prompt = f"""You are an experienced educational counselor helping students. Please respond to the following message:

Message: {message}

Please provide helpful, empathetic, and practical advice. If it's related to academics, career, or mental health, give specific suggestions. Keep the response under 200 words and be supportive."""

            # Generate response using Gemini
            response = gemini_model.generate_content(prompt)
            bot_response = response.text.strip()
            
        else:
            # Fallback to rule-based responses if Gemini is not available
            responses = {
                'en': {
                    'academic': "I understand you're facing academic challenges. Let's work together to identify the specific areas where you need support. Would you like to discuss study techniques or time management?",
                    'career': "Career planning is exciting! What are your interests and strengths? I can help you explore different career paths that align with your goals.",
                    'mental': "Your mental health is important. I'm here to listen and support you. Would you like to talk about stress management techniques or coping strategies?",
                    'default': "I'm here to help with academic, career, or personal concerns. How can I support you today?"
                },
                'hi': {
                    'academic': "मैं समझ सकता हूँ कि आप शैक्षणिक चुनौतियों का सामना कर रहे हैं। आइए मिलकर उन विशिष्ट क्षेत्रों की पहचान करें जहाँ आपको सहायता की आवश्यकता है।",
                    'career': "करियर प्लानिंग रोमांचक है! आपकी रुचियाँ और शक्तियाँ क्या हैं? मैं आपकी मदद कर सकता हूँ।",
                    'mental': "आपका मानसिक स्वास्थ्य महत्वपूर्ण है। मैं यहाँ सुनने और आपका समर्थन करने के लिए हूँ।",
                    'default': "मैं शैक्षणिक, करियर या व्यक्तिगत चिंताओं में आपकी मदद करने के लिए यहाँ हूँ।"
                }
            }
            
            # Simple keyword matching for fallback
            message_lower = message.lower()
            if any(word in message_lower for word in ['academic', 'study', 'grade', 'exam', 'शैक्षणिक', 'पढ़ाई']):
                bot_response = responses[language]['academic']
            elif any(word in message_lower for word in ['career', 'job', 'future', 'profession', 'करियर', 'नौकरी']):
                bot_response = responses[language]['career']
            elif any(word in message_lower for word in ['mental', 'stress', 'anxiety', 'worry', 'मानसिक', 'तनाव']):
                bot_response = responses[language]['mental']
            else:
                bot_response = responses[language]['default']
        
        return jsonify({
            'response': bot_response,
            'language': language,
            'timestamp': datetime.utcnow().isoformat(),
            'ai_powered': gemini_available
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        # Return a fallback response
        fallback_response = "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment." if language == 'en' else "मुझे खेद है, मैं अभी आपके अनुरोध को संसाधित करने में परेशानी हो रही है। कृपया कुछ समय बाद पुनः प्रयास करें।"
        
        return jsonify({
            'response': fallback_response,
            'language': language,
            'timestamp': datetime.utcnow().isoformat(),
            'ai_powered': False,
            'error': str(e)
        })

# Data routes
@app.route('/students', methods=['GET'])
@jwt_required()
def get_students():
    """Get list of students with basic info"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(int(current_user_id))
    
    if current_user.role not in ['teacher', 'counselor', 'admin']:
        return jsonify({'error': 'Access denied'}), 403
    
    students = User.query.filter_by(role='student').all()
    
    students_data = []
    for student in students:
        # Get latest data
        attendance = db.session.query(Attendance).filter_by(student_id=student.id).order_by(Attendance.created_at.desc()).first()
        grades = db.session.query(Grades).filter_by(student_id=student.id).all()
        alert = db.session.query(Alerts).filter_by(student_id=student.id, acknowledged=False).order_by(Alerts.created_at.desc()).first()
        
        students_data.append({
            'id': student.id,
            'name': student.name,
            'email': student.email,
            'attendance': attendance.percentage if attendance else 80,
            'average_grade': np.mean([g.score for g in grades]) if grades else 75,
            'risk_level': alert.risk_level if alert else 'low',
            'last_login': student.last_login.isoformat() if student.last_login else None
        })
    
    return jsonify(students_data)

@app.route('/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    """Get system alerts"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(int(current_user_id))
    
    if current_user.role not in ['teacher', 'counselor', 'admin']:
        return jsonify({'error': 'Access denied'}), 403
    
    alerts = db.session.query(Alerts).join(User).order_by(Alerts.created_at.desc()).limit(50).all()
    
    alerts_data = []
    for alert in alerts:
        student = User.query.get(alert.student_id)
        alerts_data.append({
            'id': alert.id,
            'student_name': student.name,
            'message': alert.message,
            'risk_level': alert.risk_level,
            'acknowledged': alert.acknowledged,
            'created_at': alert.created_at.isoformat()
        })
    
    return jsonify(alerts_data)

@app.route('/alerts/<int:alert_id>/acknowledge', methods=['POST'])
@jwt_required()
def acknowledge_alert(alert_id):
    """Acknowledge an alert"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(int(current_user_id))
    
    if current_user.role not in ['teacher', 'counselor', 'admin']:
        return jsonify({'error': 'Access denied'}), 403
    
    alert = Alerts.query.get(alert_id)
    if not alert:
        return jsonify({'error': 'Alert not found'}), 404
    
    alert.acknowledged = True
    db.session.commit()
    
    return jsonify({'message': 'Alert acknowledged'})

# Initialize database and create tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)