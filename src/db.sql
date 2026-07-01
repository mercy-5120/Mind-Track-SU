-- =====================================================
-- DATABASE: mindtracksu
-- PROJECT: MindTrackSU
-- PURPOSE: Mental wellness monitoring and burnout tracking
-- AUTHOR: Gachau Mercy Muthoni & Malwa Natalie Mideva
-- =====================================================

-- Create and use database
CREATE DATABASE IF NOT EXISTS mindtracksu;
USE mindtracksu;

-- =====================================================
-- TABLE 1: students (optional accounts for returning users)
-- =====================================================
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registration_number VARCHAR(20),
    department VARCHAR(100),
    year_of_study INT,
    anonymous_account BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP
);

-- =====================================================
-- TABLE 2: anonymous_sessions (for users without accounts)
-- =====================================================
CREATE TABLE anonymous_sessions (
    session_token VARCHAR(50) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    last_activity TIMESTAMP
);

-- =====================================================
-- TABLE 3: assessment_questions
-- =====================================================
CREATE TABLE assessment_questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('anxiety', 'depression', 'burnout', 'sleep') NOT NULL,
    question_text VARCHAR(500) NOT NULL,
    min_score INT DEFAULT 0,
    max_score INT NOT NULL,
    display_order INT NOT NULL
);

-- =====================================================
-- TABLE 4: assessments (completed assessments)
-- =====================================================
CREATE TABLE assessments (
    assessment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NULL,
    anonymous_session_token VARCHAR(50) NULL,
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_anxiety_score INT,
    total_depression_score INT,
    total_burnout_score INT,
    total_sleep_score INT,
    overall_risk_level ENUM('low', 'moderate', 'high'),
    crisis_contact_provided BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL,
    FOREIGN KEY (anonymous_session_token) REFERENCES anonymous_sessions(session_token) ON DELETE SET NULL
);

-- =====================================================
-- TABLE 5: assessment_responses (individual answers)
-- =====================================================
CREATE TABLE assessment_responses (
    response_id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    score INT NOT NULL,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES assessment_questions(question_id)
);

-- =====================================================
-- TABLE 6: risk_thresholds
-- =====================================================
CREATE TABLE risk_thresholds (
    threshold_id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('anxiety', 'depression', 'burnout', 'sleep') NOT NULL,
    risk_level ENUM('low', 'moderate', 'high') NOT NULL,
    min_score INT NOT NULL,
    max_score INT NOT NULL,
    recommended_action VARCHAR(50)
);

-- =====================================================
-- TABLE 7: feedback_library
-- =====================================================
CREATE TABLE feedback_library (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('anxiety', 'depression', 'burnout', 'sleep', 'general') NOT NULL,
    risk_level ENUM('low', 'moderate', 'high') NOT NULL,
    feedback_message TEXT NOT NULL,
    wellness_tip TEXT,
    resource_link VARCHAR(200)
);

-- =====================================================
-- TABLE 8: resources (on-campus support services)
-- =====================================================
CREATE TABLE resources (
    resource_id INT PRIMARY KEY AUTO_INCREMENT,
    resource_name VARCHAR(100) NOT NULL,
    category ENUM('counselling', 'peer_support', 'crisis', 'wellness_workshop', 'other') NOT NULL,
    description TEXT,
    contact_info VARCHAR(200),
    location VARCHAR(100),
    operating_hours VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- TABLE 9: staff_accounts
-- =====================================================
CREATE TABLE staff_accounts (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('peer_counsellor', 'sumc_counsellor', 'dean', 'staff_admin') NOT NULL,
    assigned_group VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- =====================================================
-- TABLE 10: staff_alerts
-- =====================================================
CREATE TABLE staff_alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    student_id INT NULL,
    anonymous_session_token VARCHAR(50) NULL,
    category ENUM('anxiety', 'depression', 'burnout', 'suicidal_ideation') NOT NULL,
    risk_level ENUM('moderate', 'high') NOT NULL,
    alert_status ENUM('new', 'viewed', 'acknowledged', 'resolved') DEFAULT 'new',
    assigned_staff_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL,
    FOREIGN KEY (anonymous_session_token) REFERENCES anonymous_sessions(session_token) ON DELETE SET NULL,
    FOREIGN KEY (assigned_staff_id) REFERENCES staff_accounts(staff_id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE 11: referrals
-- =====================================================
CREATE TABLE referrals (
    referral_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id INT NOT NULL,
    student_id INT NULL,
    anonymous_session_token VARCHAR(50) NULL,
    referred_to ENUM('sumc_counsellor', 'peer_counsellor') NOT NULL,
    referral_status ENUM('pending', 'accepted', 'completed', 'declined') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (alert_id) REFERENCES staff_alerts(alert_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL,
    FOREIGN KEY (anonymous_session_token) REFERENCES anonymous_sessions(session_token) ON DELETE SET NULL
);

-- =====================================================
-- TABLE 12: activity_logs (de-identified for analytics)
-- =====================================================
CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    log_date DATE NOT NULL,
    department VARCHAR(100),
    year_of_study INT,
    assessment_count INT DEFAULT 0,
    avg_anxiety_score DECIMAL(3,1),
    avg_depression_score DECIMAL(3,1),
    avg_burnout_score DECIMAL(3,1),
    avg_sleep_score DECIMAL(3,1),
    low_risk_count INT DEFAULT 0,
    moderate_risk_count INT DEFAULT 0,
    high_risk_count INT DEFAULT 0
);