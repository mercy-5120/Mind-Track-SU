-- =====================================================
-- DATABASE: mindtracksu
-- PROJECT: MindTrackSU
-- PURPOSE: Mental wellness monitoring and burnout tracking
-- AUTHOR: Gachau Mercy Muthoni & Malwa Natalie Mideva
-- =====================================================

CREATE DATABASE IF NOT EXISTS mindtracksu;
USE mindtracksu;

-- =====================================================
-- TABLE 1: students (anonymous account support)
-- =====================================================
CREATE TABLE IF NOT EXISTS students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    department VARCHAR(100),
    year_of_study INT,
    anonymous_account BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP
);

-- =====================================================
-- TABLE 2: anonymous_sessions (guest or anonymous check-ins)
-- =====================================================
CREATE TABLE IF NOT EXISTS anonymous_sessions (
    session_token VARCHAR(64) PRIMARY KEY,
    username VARCHAR(50),
    password_hash VARCHAR(255),
    assessment_started BOOLEAN DEFAULT FALSE,
    assessment_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 3: assessment_questions
-- =====================================================
CREATE TABLE IF NOT EXISTS assessment_questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('anxiety', 'depression', 'burnout', 'sleep') NOT NULL,
    question_text VARCHAR(500) NOT NULL,
    answer_options JSON NOT NULL,
    display_order INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- TABLE 4: assessments (completed assessments)
-- =====================================================
CREATE TABLE IF NOT EXISTS assessments (
    assessment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NULL,
    anonymous_session_token VARCHAR(64) NULL,
    assessment_status ENUM('started', 'completed') DEFAULT 'started',
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    total_anxiety_score INT DEFAULT 0,
    total_depression_score INT DEFAULT 0,
    total_burnout_score INT DEFAULT 0,
    total_sleep_score INT DEFAULT 0,
    overall_risk_level ENUM('low', 'moderate', 'high') DEFAULT 'low',
    crisis_contact_provided BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL,
    FOREIGN KEY (anonymous_session_token) REFERENCES anonymous_sessions(session_token) ON DELETE SET NULL
);

-- =====================================================
-- TABLE 5: assessment_responses (individual answers)
-- =====================================================
CREATE TABLE IF NOT EXISTS assessment_responses (
    response_id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    response_label VARCHAR(100) NOT NULL,
    score INT NOT NULL,
    responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES assessment_questions(question_id)
);

-- =====================================================
-- TABLE 6: risk_thresholds
-- =====================================================
CREATE TABLE IF NOT EXISTS risk_thresholds (
    threshold_id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('anxiety', 'depression', 'burnout', 'sleep') NOT NULL,
    risk_level ENUM('low', 'moderate', 'high') NOT NULL,
    min_score INT NOT NULL,
    max_score INT NOT NULL,
    recommended_action VARCHAR(200)
);

-- =====================================================
-- TABLE 7: feedback_library
-- =====================================================
CREATE TABLE IF NOT EXISTS feedback_library (
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
CREATE TABLE IF NOT EXISTS resources (
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
CREATE TABLE IF NOT EXISTS staff_accounts (
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
CREATE TABLE IF NOT EXISTS staff_alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    student_id INT NULL,
    anonymous_session_token VARCHAR(64) NULL,
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
CREATE TABLE IF NOT EXISTS referrals (
    referral_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id INT NOT NULL,
    student_id INT NULL,
    anonymous_session_token VARCHAR(64) NULL,
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
CREATE TABLE IF NOT EXISTS activity_logs (
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

-- =====================================================
-- Seed assessment questions for the 10-question flow
-- =====================================================
INSERT INTO assessment_questions (category, question_text, answer_options, display_order) VALUES
('anxiety', 'Over the past two weeks, I have felt nervous, anxious, or on edge.', JSON_ARRAY('Not at all','Several days','More than half the days','Nearly every day','Prefer not to answer'), 1),
('depression', 'I have had little interest or pleasure in doing things.', JSON_ARRAY('Not at all','Several days','More than half the days','Nearly every day','Prefer not to answer'), 2),
('burnout', 'I feel emotionally drained by my studies or work.', JSON_ARRAY('Not at all','Several days','More than half the days','Nearly every day','Prefer not to answer'), 3),
('sleep', 'My sleep has been restless or disrupted.', JSON_ARRAY('Not at all','Several days','More than half the days','Nearly every day','Prefer not to answer'), 4),
('anxiety', 'I have had trouble relaxing or calming down.', JSON_ARRAY('Not at all','Several days','More than half the days','Nearly every day','Prefer not to answer'), 5),
('depression', 'I have felt down, depressed, or hopeless.', JSON_ARRAY('Not at all','Several days','More than half the days','Nearly every day','Prefer not to answer'), 6),
('burnout', 'I feel unable to keep up with my responsibilities.', JSON_ARRAY('Not at all','Several days','More than half the days','Nearly every day','Prefer not to answer'), 7),
('sleep', 'I have had trouble falling asleep or staying asleep.', JSON_ARRAY('Not at all','Several days','More than half the days','Nearly every day','Prefer not to answer'), 8),
('anxiety', 'I have been easily annoyed or irritable.', JSON_ARRAY('Not at all','Several days','More than half the days','Nearly every day','Prefer not to answer'), 9),
('depression', 'I have found it difficult to focus on tasks or schoolwork.', JSON_ARRAY('Not at all','Several days','More than half the days','Nearly every day','Prefer not to answer'), 10)
ON DUPLICATE KEY UPDATE question_text = VALUES(question_text), answer_options = VALUES(answer_options), display_order = VALUES(display_order);

-- =====================================================
-- Seed risk thresholds
-- =====================================================
INSERT INTO risk_thresholds (category, risk_level, min_score, max_score, recommended_action) VALUES
('anxiety', 'low', 0, 39, 'Self-care and reflection'),
('anxiety', 'moderate', 40, 69, 'Support resources'),
('anxiety', 'high', 70, 100, 'Immediate support'),
('depression', 'low', 0, 39, 'Self-care and reflection'),
('depression', 'moderate', 40, 69, 'Support resources'),
('depression', 'high', 70, 100, 'Immediate support'),
('burnout', 'low', 0, 39, 'Rest and balance'),
('burnout', 'moderate', 40, 69, 'Wellness check-in'),
('burnout', 'high', 70, 100, 'Counselling support'),
('sleep', 'low', 0, 39, 'Healthy routine'),
('sleep', 'moderate', 40, 69, 'Rest and habits'),
('sleep', 'high', 70, 100, 'Support and rest plan')
ON DUPLICATE KEY UPDATE recommended_action = VALUES(recommended_action);

-- =====================================================
-- Seed feedback messages and resources
-- =====================================================
INSERT INTO feedback_library (category, risk_level, feedback_message, wellness_tip, resource_link) VALUES
('general', 'low', 'You seem to be managing well overall. Keep checking in and use the resources when needed.', 'Take a short break, breathe deeply, and keep a gentle routine.', '/resources'),
('general', 'moderate', 'You may be carrying a lot right now. A little support could make a meaningful difference.', 'Try a short walk, journaling, or a calm conversation with someone you trust.', '/resources'),
('general', 'high', 'Your responses suggest you may need extra support right now.', 'Please reach out to a trusted person or use the crisis support options available.', '/crisis')
ON DUPLICATE KEY UPDATE feedback_message = VALUES(feedback_message), wellness_tip = VALUES(wellness_tip), resource_link = VALUES(resource_link);

INSERT INTO resources (resource_name, category, description, contact_info, location, operating_hours, is_active) VALUES
('SUMC Counselling Services', 'counselling', 'Professional counselling support for students.', '+254 703 034 000', 'SUMC, Madaraka Campus', 'Mon-Fri, 8:00-17:00', TRUE),
('Peer Counsellors', 'peer_support', 'Trained student peers who offer compassionate support.', 'Visit the Dean of Students Office', 'Student Affairs', 'Daily, 10:00-16:00', TRUE),
('Mindful Wellness Workshops', 'wellness_workshop', 'Student-led sessions on resilience and balance.', 'SUMC student wellness desk', 'Various campus locations', 'Weekly calendar', TRUE),
('Crisis Helpline 1199', 'crisis', 'Immediate mental health crisis support.', '1199 (toll free)', 'Phone', '24/7', TRUE)
ON DUPLICATE KEY UPDATE description = VALUES(description), contact_info = VALUES(contact_info), location = VALUES(location), operating_hours = VALUES(operating_hours), is_active = VALUES(is_active);