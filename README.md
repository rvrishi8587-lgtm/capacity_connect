# 🇮🇳 Capacity Connect

## Digital Capacity Building & Learning Management Portal

**Team SEES — Systems Engineering Execution & Security**  
**Smart India Hackathon 2026 | Problem Statement 26075**

---

## 📌 Problem Statement

**Problem Statement ID:** 26075  
**Organization:** Ministry of Earth Sciences (MoES)  
**Department:** India Meteorological Department (IMD)  
**Category:** Software  
**Theme:** Smart Education

The problem calls for a centralized digital platform for organizational training, competency development, learning resources, assessments, feedback, trainer management and competency mapping.

---

## 💡 Our Solution

**Capacity Connect** is a web-based prototype designed to centralize employee training and learning activities in one platform.

It connects:

- Trainees with courses and learning resources
- Trainers with learners and training opportunities
- Administrators with platform and user management
- Skills and qualifications with suitable trainer requirements

---

## 🚀 Implemented Features

### 👨‍🎓 Trainee

- Registration and login
- Profile with skills, qualifications and experience
- Browse available courses
- Course enrollment
- Learning materials and lessons
- Learning progress tracking
- MCQ-based assessments
- Assessment results and scores
- Feedback and support ticket system
- Notifications

### 👨‍🏫 Trainer

- Trainer dashboard
- Trainer profile
- View/create courses
- Add MCQ questions
- Monitor enrolled students
- View assessment performance
- Trainer opportunities
- Apply for training requirements
- Feedback inbox

### 🛠️ Admin

- Admin dashboard
- User management
- Course management/viewing
- Trainer requirements
- Trainer competency matching
- Feedback/ticket management
- Platform statistics and analytics
- Notifications

---

## 🎯 Competency Mapping

The platform includes a competency-matching system that compares trainer requirements with candidate information such as:

- Skills
- Qualification
- Work experience
- Relevant training experience

This generates a **match score** to help identify suitable trainers.

---

## 🎫 Feedback & Support

A ticket-based support system is implemented for trainees.

Tickets are routed according to category:

| Category | Routed To |
|---|---|
| Technical Error | Admin |
| Academic Issue | Trainer |
| Course / Trainer Feedback | Trainer |

Trainers and administrators can reply to tickets, and trainees can track their ticket status.

---

## 🔔 Notifications

The prototype includes notification functionality for activities such as:

- New tickets
- Ticket replies
- Trainer opportunities
- Platform activities

---

## 🎨 Interface

The platform uses a unified **government-oriented visual design** featuring:

- Deep navy
- Teal
- Saffron
- White

The interface includes dedicated dashboards and responsive layouts for different user roles.

---

## 🧰 Technology Stack

- HTML5
- CSS3
- JavaScript
- Vite
- Browser `localStorage`

### Data & Backend

This version is a **frontend prototype**.

There is **no external backend server, API, SQL database, or cloud database implemented in the current version**.

Application data such as users, courses, enrollments, assessments, notifications and tickets are handled through JavaScript and browser `localStorage`.

---

## 📁 Project Structure

```text
capacity_connect/
├── config/
├── index.html
├── login.html
├── register.html
├── courses.html
├── course-details.html
├── trainee-dashboard.html
├── trainer-dashboard.html
├── admin-dashboard.html
├── assessment.html
├── feedback.html
├── about.html
├── app.js
├── style.css
├── package.json
└── README.md
