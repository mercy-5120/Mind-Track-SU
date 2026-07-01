-- =====================================================
-- DATABASE: mindtracksu
-- PROJECT: MindTrackSU
-- PURPOSE: Mental wellness monitoring and burnout tracking
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS mindtracksu;
USE mindtracksu;

-- =====================================================
-- TABLE: students
-- =====================================================
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    department VARCHAR(255),
    year_of_study INT,
    anonymous_account TINYINT DEFAULT 1,
    is_active TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: anonymous_sessions
-- =====================================================
CREATE TABLE anonymous_sessions (
    session_token VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255),
    password_hash VARCHAR(255),
    assessment_started TINYINT DEFAULT 0,
    assessment_completed TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: assessment_questions
-- =====================================================
CREATE TABLE assessment_questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('anxiety', 'depression', 'burnout', 'sleep') NOT NULL,
    question_text TEXT NOT NULL,
    answer_options JSON NOT NULL,  -- MySQL 5.7+ supports JSON
    display_order INT NOT NULL,
    is_active TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: assessments
-- =====================================================
CREATE TABLE assessments (
    assessment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    anonymous_session_token VARCHAR(255),
    assessment_status ENUM('started', 'completed') DEFAULT 'started',
    assessment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    total_anxiety_score INT DEFAULT 0,
    total_depression_score INT DEFAULT 0,
    total_burnout_score INT DEFAULT 0,
    total_sleep_score INT DEFAULT 0,
    overall_risk_level ENUM('low', 'moderate', 'high') DEFAULT 'low',
    crisis_contact_provided TINYINT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL,
    FOREIGN KEY (anonymous_session_token) REFERENCES anonymous_sessions(session_token) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: assessment_responses
-- =====================================================
CREATE TABLE assessment_responses (
    response_id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    response_label VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    responded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES assessment_questions(question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: risk_thresholds
-- =====================================================
CREATE TABLE risk_thresholds (
    threshold_id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('anxiety', 'depression', 'burnout', 'sleep') NOT NULL,
    risk_level ENUM('low', 'moderate', 'high') NOT NULL,
    min_score INT NOT NULL,
    max_score INT NOT NULL,
    recommended_action VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: feedback_library
-- =====================================================
CREATE TABLE feedback_library (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('anxiety', 'depression', 'burnout', 'sleep', 'general') NOT NULL,
    risk_level ENUM('low', 'moderate', 'high') NOT NULL,
    feedback_message TEXT NOT NULL,
    wellness_tip TEXT,
    resource_link VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: resources
-- =====================================================
CREATE TABLE resources (
    resource_id INT PRIMARY KEY AUTO_INCREMENT,
    resource_name VARCHAR(255) NOT NULL,
    category ENUM('counselling', 'peer_support', 'crisis', 'wellness_workshop', 'other') NOT NULL,
    description TEXT,
    contact_info VARCHAR(255),
    location VARCHAR(255),
    operating_hours VARCHAR(255),
    is_active TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: staff_accounts (fixed table name)
-- =====================================================
CREATE TABLE staff_accounts (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    assigned_group VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: staff_database_registry
-- =====================================================
CREATE TABLE staff_database_registry (
    staff_id INT PRIMARY KEY,
    database_name VARCHAR(64) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff_accounts(staff_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: staff_alerts
-- =====================================================
CREATE TABLE staff_alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT,
    category VARCHAR(255) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    alert_status ENUM('new', 'pending', 'resolved', 'closed') DEFAULT 'new',
    assigned_staff_id INT,
    student_name VARCHAR(255),
    student_identifier VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (assigned_staff_id) REFERENCES staff_accounts(staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: referrals
-- =====================================================
CREATE TABLE referrals (
    referral_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id INT,
    referred_to VARCHAR(255) NOT NULL,
    referral_status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    student_name VARCHAR(255),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (alert_id) REFERENCES staff_alerts(alert_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: followups
-- =====================================================
CREATE TABLE followups (
    followup_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id INT,
    staff_id INT,
    notes TEXT NOT NULL,
    followup_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES staff_alerts(alert_id),
    FOREIGN KEY (staff_id) REFERENCES staff_accounts(staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: messages
-- =====================================================
CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id INT,
    sender_role VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: activity_logs
-- =====================================================
CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    log_date DATE NOT NULL,
    department VARCHAR(255),
    year_of_study INT,
    assessment_count INT DEFAULT 0,
    avg_anxiety_score DECIMAL(5,2),
    avg_depression_score DECIMAL(5,2),
    avg_burnout_score DECIMAL(5,2),
    avg_sleep_score DECIMAL(5,2),
    low_risk_count INT DEFAULT 0,
    moderate_risk_count INT DEFAULT 0,
    high_risk_count INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT DATA
-- =====================================================

-- Assessment Questions
INSERT INTO assessment_questions (question_id, category, question_text, answer_options, display_order) VALUES
(1, 'anxiety', 'Over the past two weeks, I have felt nervous, anxious, or on edge.', '["Not at all","Several days","More than half the days","Nearly every day","Prefer not to answer"]', 1),
(2, 'depression', 'I have had little interest or pleasure in doing things.', '["Not at all","Several days","More than half the days","Nearly every day","Prefer not to answer"]', 2),
(3, 'burnout', 'I feel emotionally drained by my studies or work.', '["Not at all","Several days","More than half the days","Nearly every day","Prefer not to answer"]', 3),
(4, 'sleep', 'My sleep has been restless or disrupted.', '["Not at all","Several days","More than half the days","Nearly every day","Prefer not to answer"]', 4),
(5, 'anxiety', 'I have had trouble relaxing or calming down.', '["Not at all","Several days","More than half the days","Nearly every day","Prefer not to answer"]', 5),
(6, 'depression', 'I have felt down, depressed, or hopeless.', '["Not at all","Several days","More than half the days","Nearly every day","Prefer not to answer"]', 6),
(7, 'burnout', 'I feel unable to keep up with my responsibilities.', '["Not at all","Several days","More than half the days","Nearly every day","Prefer not to answer"]', 7),
(8, 'sleep', 'I have had trouble falling asleep or staying asleep.', '["Not at all","Several days","More than half the days","Nearly every day","Prefer not to answer"]', 8),
(9, 'anxiety', 'I have been easily annoyed or irritable.', '["Not at all","Several days","More than half the days","Nearly every day","Prefer not to answer"]', 9),
(10, 'depression', 'I have found it difficult to focus on tasks or schoolwork.', '["Not at all","Several days","More than half the days","Nearly every day","Prefer not to answer"]', 10);

-- Risk Thresholds
INSERT INTO risk_thresholds (threshold_id, category, risk_level, min_score, max_score, recommended_action) VALUES
(1, 'anxiety', 'low', 0, 39, 'Self-care and reflection'),
(2, 'anxiety', 'moderate', 40, 69, 'Support resources'),
(3, 'anxiety', 'high', 70, 100, 'Immediate support'),
(4, 'depression', 'low', 0, 39, 'Self-care and reflection'),
(5, 'depression', 'moderate', 40, 69, 'Support resources'),
(6, 'depression', 'high', 70, 100, 'Immediate support'),
(7, 'burnout', 'low', 0, 39, 'Rest and balance'),
(8, 'burnout', 'moderate', 40, 69, 'Wellness check-in'),
(9, 'burnout', 'high', 70, 100, 'Counselling support'),
(10, 'sleep', 'low', 0, 39, 'Healthy routine'),
(11, 'sleep', 'moderate', 40, 69, 'Rest and habits'),
(12, 'sleep', 'high', 70, 100, 'Support and rest plan');

-- Feedback Library
INSERT INTO feedback_library (feedback_id, category, risk_level, feedback_message, wellness_tip, resource_link) VALUES
(1, 'general', 'low', 'You seem to be managing well overall. Keep checking in and use the resources when needed.', 'Take a short break, breathe deeply, and keep a gentle routine.', '/resources'),
(2, 'general', 'moderate', 'You may be carrying a lot right now. A little support could make a meaningful difference.', 'Try a short walk, journaling, or a calm conversation with someone you trust.', '/resources'),
(3, 'general', 'high', 'Your responses suggest you may need extra support right now.', 'Please reach out to a trusted person or use the crisis support options available.', '/crisis');

-- Resources
INSERT INTO resources (resource_id, resource_name, category, description, contact_info, location, operating_hours, is_active) VALUES
(1, 'SUMC Counselling Services', 'counselling', 'Professional counselling support for students.', '+254 703 034 000', 'SUMC, Madaraka Campus', 'Mon-Fri, 8:00-17:00', 1),
(2, 'Peer Counsellors', 'peer_support', 'Trained student peers who offer compassionate support.', 'Visit the Dean of Students Office', 'Student Affairs', 'Daily, 10:00-16:00', 1),
(3, 'Mindful Wellness Workshops', 'wellness_workshop', 'Student-led sessions on resilience and balance.', 'SUMC student wellness desk', 'Various campus locations', 'Weekly calendar', 1),
(4, 'Crisis Helpline 1199', 'crisis', 'Immediate mental health crisis support.', '1199 (toll free)', 'Phone', '24/7', 1);

-- Staff Accounts
INSERT INTO staff_accounts (staff_id, email, name, role, assigned_group) VALUES
(1, 'sumc@strathmore.ac.ke', 'Jane Doe', 'sumc_counsellor', 'SUMC'),
(2, 'peer@strathmore.ac.ke', 'Alex Kim', 'peer_counsellor', 'Peer Support');

-- Staff database mapping
INSERT INTO staff_database_registry (staff_id, database_name) VALUES
(1, 'mindtracksu_staff_1'),
(2, 'mindtracksu_staff_2');

-- Staff Alerts
INSERT INTO staff_alerts (alert_id, assessment_id, category, risk_level, alert_status, assigned_staff_id, student_name, student_identifier, created_at) VALUES
(1, 101, 'depression', 'high', 'new', 1, 'Student A', '•••••7890', '2026-06-16 09:00:00'),
(2, 102, 'anxiety', 'high', 'pending', 2, 'Student B', '•••••4512', '2026-06-15 11:30:00'),
(3, 103, 'burnout', 'moderate', 'resolved', 2, 'Student C', '•••••3321', '2026-06-14 16:00:00');

-- Referrals
INSERT INTO referrals (referral_id, alert_id, referred_to, referral_status, student_name, notes, created_at) VALUES
(1, 1, 'sumc_counsellor', 'pending', 'Student A', 'Need supervised counseling follow-up', '2026-06-16 10:00:00'),
(2, 2, 'peer_counsellor', 'accepted', 'Student B', 'Peer support assigned', '2026-06-15 12:00:00');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all tables
SHOW TABLES;

