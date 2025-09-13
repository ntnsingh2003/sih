import os
import sys
from datetime import datetime, date, timedelta
import random
import numpy as np

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, User, Attendance, Grades, Fees, Surveys, Alerts

def seed_database():
    """Seed the database with mock data for demonstration"""
    
    with app.app_context():
        # Drop and recreate all tables
        db.drop_all()
        db.create_all()
        
        print("Creating demo users...")
        
        # Create demo users
        demo_users = [
            {'name': 'Admin User', 'email': 'admin@demo.com', 'password': 'demo123', 'role': 'admin'},
            {'name': 'Sarah Wilson', 'email': 'teacher@demo.com', 'password': 'demo123', 'role': 'teacher'},
            {'name': 'Dr. Mike Chen', 'email': 'counselor@demo.com', 'password': 'demo123', 'role': 'counselor'},
            {'name': 'Rahul Sharma', 'email': 'student@demo.com', 'password': 'demo123', 'role': 'student'},
        ]
        
        users = []
        for user_data in demo_users:
            user = User(
                name=user_data['name'],
                email=user_data['email'],
                role=user_data['role']
            )
            user.set_password(user_data['password'])
            user.last_login = datetime.utcnow() - timedelta(days=random.randint(0, 7))
            users.append(user)
            db.session.add(user)
        
        # Add more students for demo
        student_names = [
            'Priya Patel', 'Amit Kumar', 'Sneha Singh', 'Vikram Joshi', 'Anita Gupta',
            'Ravi Verma', 'Pooja Sharma', 'Arun Reddy', 'Kavya Nair', 'Deepak Singh',
            'Meera Jain', 'Suresh Kumar', 'Nidhi Agarwal', 'Rohit Gupta', 'Sunita Rao',
            'Ajay Sharma', 'Preeti Singh', 'Manoj Kumar', 'Geeta Devi', 'Rakesh Jain'
        ]
        
        for i, name in enumerate(student_names):
            user = User(
                name=name,
                email=f'student{i+2}@demo.com',
                role='student'
            )
            user.set_password('demo123')
            user.last_login = datetime.utcnow() - timedelta(days=random.randint(0, 10))
            users.append(user)
            db.session.add(user)
        
        db.session.commit()
        print(f"Created {len(users)} users")
        
        # Get student users
        students = [u for u in users if u.role == 'student']
        
        print("Creating attendance data...")
        
        # Create attendance data
        months = ['January', 'February', 'March', 'April', 'May', 'June']
        for student in students:
            for month in months:
                # Create realistic attendance patterns
                if student.name in ['Rahul Sharma', 'Sneha Singh']:  # High risk students
                    attendance_pct = random.uniform(50, 70)
                elif student.name in ['Priya Patel', 'Vikram Joshi']:  # Medium risk
                    attendance_pct = random.uniform(75, 85)
                else:  # Low risk students
                    attendance_pct = random.uniform(85, 98)
                
                attendance = Attendance(
                    student_id=student.id,
                    percentage=round(attendance_pct, 2),
                    month=month,
                    year=2024,
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 180))
                )
                db.session.add(attendance)
        
        print("Creating grades data...")
        
        # Create grades data
        subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Biology']
        semesters = ['Fall 2023', 'Spring 2024']
        
        for student in students:
            for semester in semesters:
                for subject in random.sample(subjects, random.randint(4, 6)):
                    # Create realistic grade patterns
                    if student.name in ['Rahul Sharma', 'Sneha Singh']:  # High risk students
                        grade = random.uniform(60, 75)
                    elif student.name in ['Priya Patel', 'Vikram Joshi']:  # Medium risk
                        grade = random.uniform(75, 85)
                    else:  # Low risk students
                        grade = random.uniform(80, 95)
                    
                    grades = Grades(
                        student_id=student.id,
                        subject=subject,
                        score=round(grade, 2),
                        semester=semester,
                        year=2024,
                        created_at=datetime.utcnow() - timedelta(days=random.randint(0, 120))
                    )
                    db.session.add(grades)
        
        print("Creating fees data...")
        
        # Create fees data
        for student in students:
            for i in range(random.randint(2, 4)):
                # Create realistic fee patterns
                if student.name in ['Rahul Sharma', 'Sneha Singh']:  # Financial issues
                    status = random.choice(['pending', 'overdue', 'overdue', 'paid'])
                    amount_paid_pct = random.uniform(0.3, 0.8)
                else:
                    status = random.choice(['paid', 'paid', 'paid', 'pending'])
                    amount_paid_pct = random.uniform(0.8, 1.0)
                
                amount_due = random.uniform(5000, 15000)
                amount_paid = amount_due * amount_paid_pct if status == 'paid' else amount_due * random.uniform(0, 0.7)
                
                fees = Fees(
                    student_id=student.id,
                    status=status,
                    amount_due=round(amount_due, 2),
                    amount_paid=round(amount_paid, 2),
                    due_date=date.today() + timedelta(days=random.randint(-30, 60)),
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 90))
                )
                db.session.add(fees)
        
        print("Creating survey data...")
        
        # Create survey data
        survey_types = ['academic_satisfaction', 'mental_health_check', 'career_interests']
        
        for student in students:
            for survey_type in random.sample(survey_types, random.randint(1, 3)):
                # Create realistic survey responses
                if student.name in ['Rahul Sharma', 'Sneha Singh']:  # High risk students
                    responses = {
                        'family_support': random.randint(1, 2),
                        'study_hours': random.randint(1, 3),
                        'extracurricular': random.randint(0, 1),
                        'mental_health': random.randint(1, 2),
                        'financial_difficulty': random.randint(4, 5),
                        'academic_satisfaction': random.randint(1, 3)
                    }
                elif student.name in ['Priya Patel', 'Vikram Joshi']:  # Medium risk
                    responses = {
                        'family_support': random.randint(2, 4),
                        'study_hours': random.randint(3, 5),
                        'extracurricular': random.randint(1, 3),
                        'mental_health': random.randint(2, 4),
                        'financial_difficulty': random.randint(2, 4),
                        'academic_satisfaction': random.randint(3, 4)
                    }
                else:  # Low risk students
                    responses = {
                        'family_support': random.randint(4, 5),
                        'study_hours': random.randint(4, 6),
                        'extracurricular': random.randint(2, 5),
                        'mental_health': random.randint(4, 5),
                        'financial_difficulty': random.randint(1, 2),
                        'academic_satisfaction': random.randint(4, 5)
                    }
                
                survey = Surveys(
                    student_id=student.id,
                    responses=responses,
                    survey_type=survey_type,
                    completed_at=datetime.utcnow() - timedelta(days=random.randint(0, 60))
                )
                db.session.add(survey)
        
        print("Creating alerts data...")
        
        # Create alerts for high-risk students
        high_risk_students = [s for s in students if s.name in ['Rahul Sharma', 'Sneha Singh']]
        medium_risk_students = [s for s in students if s.name in ['Priya Patel', 'Vikram Joshi']]
        
        alert_messages = {
            'high': [
                "Student showing signs of academic distress - immediate intervention recommended",
                "Multiple risk factors detected - contact family and counselor",
                "Attendance and performance declining rapidly",
                "Financial difficulties affecting academic performance"
            ],
            'medium': [
                "Student attendance below optimal levels",
                "Grade performance showing concerning trends",
                "Recommended for additional academic support",
                "Monitor closely for risk escalation"
            ]
        }
        
        for student in high_risk_students:
            alert = Alerts(
                student_id=student.id,
                risk_level='high',
                message=f"{student.name}: {random.choice(alert_messages['high'])}",
                acknowledged=random.choice([True, False]),
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 7))
            )
            db.session.add(alert)
        
        for student in medium_risk_students:
            if random.random() > 0.5:  # 50% chance of having an alert
                alert = Alerts(
                    student_id=student.id,
                    risk_level='medium',
                    message=f"{student.name}: {random.choice(alert_messages['medium'])}",
                    acknowledged=random.choice([True, False]),
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 14))
                )
                db.session.add(alert)
        
        db.session.commit()
        
        print("\n🎉 Database seeded successfully!")
        print("\n📊 Summary:")
        print(f"   • Users: {len(users)} ({len(students)} students)")
        print(f"   • Attendance records: {len(months) * len(students)}")
        print(f"   • Grade records: {len(students) * len(semesters) * 5} (avg)")
        print(f"   • Fee records: {len(students) * 3} (avg)")
        print(f"   • Survey responses: {len(students) * 2} (avg)")
        print(f"   • Alerts: {len(high_risk_students) + len(medium_risk_students)//2} (approx)")
        
        print("\n🔐 Demo Login Credentials:")
        for user_data in demo_users:
            print(f"   • {user_data['role'].title()}: {user_data['email']} / demo123")

if __name__ == '__main__':
    seed_database()