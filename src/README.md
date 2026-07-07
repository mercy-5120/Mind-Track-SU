# MindTrackSU

MindTrackSU is a comprehensive mental health and wellness tracking platform for Strathmore University students and staff. The platform provides role-based access for students, peer counsellors, SUMC counsellors, and deans to manage wellness resources, track high-risk alerts, and coordinate referrals.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Login Credentials](#login-credentials)
- [Role-Based Access](#role-based-access)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

---

# Features

## For Students

- Anonymous wellness assessments
- Access to mental health resources
- Track personal wellness journey

## For SUMC Counsellors

- Dashboard with overview statistics
- High-Risk Alert management
- Create and manage referrals
- Schedule counselling sessions
- Manage wellness resources
- Add new resources to the library

## For Peer Counsellors

- Dashboard with assigned tasks
- View referrals from SUMC
- Follow-up notes management
- High-Risk Alerts monitoring

## For Deans

- Institutional dashboard
- Monitor student wellness trends
- Oversee counselling operations

---

# Tech Stack

## Frontend

- React 18
- Vite
- React Router v6
- CSS Modules
- Font Awesome

## Backend

- Node.js
- Express.js
- bcrypt
- MariaDB / MySQL

## Development Tools

- Git
- GitHub

---

# Project Structure

```text
Mind-Track-SU/
│
├── src/
│   ├── api/
│   │   └── staffApi.js
│   │
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   └── StaffBrand.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── StaffLogin.jsx
│   │   └── staff/
│   │       ├── peer/
│   │       ├── sumc/
│   │       └── dean/
│   │
│   ├── server/
│   │   ├── index.js
│   │   ├── database.js
│   │   └── generate-hash.js
│   │
│   ├── styles/
│   │   └── Sidebar.module.css
│   │
│   ├── utils/
│   │   └── studentSession.js
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# Installation

## Prerequisites

- Node.js v18+
- MariaDB or MySQL
- Git

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/mercy-5120/Mind-Track-SU.git
cd Mind-Track-SU/src
```

---

## Step 2: Install Dependencies

```bash
npm install
```

---

## Step 3: Configure Environment Variables

Create a `.env` file inside the **src** directory.

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mindtracksu

# Backend
PORT=3001

# Frontend
VITE_API_URL=http://localhost:3001/api
```

---

## Step 4: Create the Database

```sql
CREATE DATABASE mindtracksu;
USE mindtracksu;
```

---

# Database Setup

## Staff Accounts

```sql
CREATE TABLE IF NOT EXISTS staff_accounts (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('sumc_counsellor','peer_counsellor','dean') NOT NULL,
    assigned_group VARCHAR(100),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO staff_accounts
(email,password_hash,name,role,assigned_group,department,is_active)
VALUES
('sumc@strathmore.edu',
'$2b$10$A3DPNPdjB5qYQ48XwHz2TeQDPvZPOk5VA3xqyEucSfl0N2zCqRLaG',
'SUMC Counsellor',
'sumc_counsellor',
'SUMC',
'Student Wellness',
1),

('peer@strathmore.edu',
'$2b$10$.j.8N4V7iLitVMq/iiA8J.rHQmjUlwpwA2euOFuXwrWrIrG53b8Hq',
'Peer Counsellor',
'peer_counsellor',
'Peer Support',
'Student Affairs',
1),

('dean@strathmore.edu',
'$2b$10$6YRV8esJCxAQBQ9d.FM12O/cEMPmhyu4B7O1O2Y.ehXynXtdBdOry',
'Dr. Dean',
'dean',
'Dean of Students',
'Student Affairs',
1);
```

---

## Students

```sql
CREATE TABLE IF NOT EXISTS students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    department VARCHAR(255),
    year_of_study INT,
    anonymous_account BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME
);

INSERT INTO students
(username,password_hash,display_name,department,year_of_study,is_active)
VALUES
(
'student@strathmore.edu',
'$2b$10$A3DPNPdjB5qYQ48XwHz2TeQDPvZPOk5VA3xqyEucSfl0N2zCqRLaG',
'Test Student',
'Computer Science',
3,
1
);
```

---

## Staff Alerts

```sql
CREATE TABLE IF NOT EXISTS staff_alert (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(100),
    risk_level VARCHAR(50),
    alert_status VARCHAR(50),
    student_name VARCHAR(100),
    student_identifier VARCHAR(100),
    assigned_staff_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_staff_id)
        REFERENCES staff_accounts(staff_id)
);
```

---

## Referrals

```sql
CREATE TABLE IF NOT EXISTS referrals (
    referral_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id INT,
    referred_to VARCHAR(100),
    referral_status VARCHAR(50),
    student_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id)
        REFERENCES staff_alert(alert_id)
);
```

---

## Follow-Ups

```sql
CREATE TABLE IF NOT EXISTS followups (
    followup_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id INT,
    staff_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id)
        REFERENCES staff_alert(alert_id),
    FOREIGN KEY (staff_id)
        REFERENCES staff_accounts(staff_id)
);
```

---

## Messages

```sql
CREATE TABLE IF NOT EXISTS messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id INT,
    sender_role VARCHAR(50),
    recipient VARCHAR(100),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id)
        REFERENCES staff_alert(alert_id)
);
```

---

## Resources

```sql
CREATE TABLE IF NOT EXISTS resources (
    resource_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    link VARCHAR(500),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Running the Application

## Start the Backend

```bash
cd D:\MindTrack SU\Mind-Track-SU\src
npm start
```

Expected output:

```text
Staff API listening on port 3001
```

---

## Start the Frontend

```bash
cd D:\MindTrack SU\Mind-Track-SU\src
npm run dev
```

Expected output:

```text
VITE v5.x ready
```

---

## Access the Application

| Page | URL |
|------|-----|
| Staff Login | http://localhost:3000/staff/login |
| Student Login | http://localhost:3000/login |
| Anonymous Assessment | http://localhost:3000/assessment-intro |

---

## Production Build

```bash
npm run build
```

---

# Login Credentials

## Staff Accounts

| Email | Password | Role |
|--------|----------|------|
| sumc@strathmore.edu | sumc123 | SUMC Counsellor |
| peer@strathmore.edu | peer123 | Peer Counsellor |
| dean@strathmore.edu | dean123 | Dean |

---

## Student Account

| Username | Password |
|----------|----------|
| student@strathmore.edu | student123 |

---

# Role-Based Access

## SUMC Counsellor

- Dashboard
- High-Risk Alerts
- Create Referral
- Schedule Sessions
- Resources
- Add Resources

---

## Peer Counsellor

- Dashboard
- Referrals
- Follow-Up Notes
- High-Risk Alerts

---

## Dean

- Dashboard
- Institutional Analytics
- Student Wellness Trends

---

# API Endpoints

## Staff

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/staff/login` | Staff authentication |
| GET | `/api/staff/alerts` | Get alerts |
| PUT | `/api/staff/alerts/:id/status` | Update alert |
| GET | `/api/staff/referrals` | Get referrals |
| POST | `/api/staff/referrals` | Create referral |
| PUT | `/api/staff/referrals/:id` | Update referral |
| GET | `/api/staff/followups/:alertId` | Get follow-ups |
| POST | `/api/staff/followups` | Create follow-up |
| GET | `/api/staff/resources` | Get resources |
| POST | `/api/staff/messages` | Send message |
| GET | `/api/staff/messages/:alertId` | Get messages |

---

## Student

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/student/login` | Student authentication |

---

# Troubleshooting

## Cannot find module "bcrypt"

```bash
npm install bcrypt
```

---

## Login returns 404

- Ensure the backend is running.
- Verify the backend is using port **3001**.
- Check the Vite proxy configuration.

---

## 401 Unauthorized

- Verify login credentials.
- Check password hashes.
- Generate a new hash if necessary.

---

## Module Not Found

```bash
npm install
```

---

## Database Connection Failed

- Verify the `.env` file.
- Ensure MariaDB/MySQL is running.
- Confirm the database name is `mindtracksu`.

---

## Sidebar Shows Incorrect Options

Open the browser console.

```javascript
console.log(sessionStorage.getItem("staffRole"));
console.log(sessionStorage);
```

---

## Debug API Calls

1. Press **F12**
2. Open the **Network** tab.
3. Perform the login request.
4. Inspect the request and response.

---

# Contributors

- Gachau Mercy Muthoni(@mercy-5120)
- midevaa(@midevaa)

---

# License

This project was developed for educational purposes at Strathmore University.

---

# Acknowledgements

- Strathmore University
- Strathmore University Medical Centre (SUMC)
- All contributors and testers

---

**Built for Strathmore University**