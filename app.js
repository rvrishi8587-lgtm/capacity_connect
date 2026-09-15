/* ============================================================
   CAPACITY CONNECT — MVP
   Core application logic (auth, data, page initializers)
   Vanilla JavaScript + localStorage
   ============================================================ */

/* ---------- Storage keys ---------- */
const KEYS = {
  USERS: "cc_users",
  CURRENT: "cc_current_user",
  COURSES: "cc_courses",
  ENROLLMENTS: "cc_enrollments",
  PROGRESS: "cc_progress",
  QUESTIONS: "cc_questions",
  RESULTS: "cc_results",
  REQUIREMENTS: "cc_trainer_requirements",
  APPLICATIONS: "cc_trainer_applications",
  NOTIFICATIONS: "cc_notifications",
};

/* ---------- Generic helpers ---------- */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------- Sample data seeding ---------- */
function seedData() {
  if (!load(KEYS.USERS, null)) {
    const users = [
      { id: "u-admin", name: "Admin User", email: "admin@test.com", password: "123456", role: "admin", status: "approved" },
      { id: "u-trainee", name: "Trainee User", email: "trainee@test.com", password: "123456", role: "trainee", status: "approved" },
      { id: "u-trainer", name: "Trainer User", email: "trainer@test.com", password: "123456", role: "trainer", status: "approved" },
    ];
    save(KEYS.USERS, users);
  }

  if (!load(KEYS.COURSES, null)) {
    const courses = [
      {
        id: "c-python",
        title: "Python Basics",
        description: "Learn the fundamentals of Python programming — variables, loops, functions, and data structures.",
        subject: "Programming",
        difficulty: "Beginner",
        duration: "4 weeks",
        trainerId: "u-trainer",
        trainerName: "Trainer User",
        icon: "🐍",
      },
      {
        id: "c-web",
        title: "Web Development Fundamentals",
        description: "Understand how the web works — HTML, CSS, JavaScript, and building your first web pages.",
        subject: "Web",
        difficulty: "Beginner",
        duration: "6 weeks",
        trainerId: "u-trainer",
        trainerName: "Trainer User",
        icon: "🌐",
      },
      {
        id: "c-data",
        title: "Data Analytics Basics",
        description: "Introduction to data analysis — collecting, cleaning, visualizing, and interpreting data.",
        subject: "Data",
        difficulty: "Intermediate",
        duration: "5 weeks",
        trainerId: "u-trainer",
        trainerName: "Trainer User",
        icon: "📊",
      },
    ];
    save(KEYS.COURSES, courses);
  }

  if (!load(KEYS.QUESTIONS, null)) {
    const questions = [
      {
        id: "q1",
        courseId: "c-python",
        question: "Which keyword is used to define a function in Python?",
        options: ["func", "def", "function", "lambda"],
        correct: 1,
      },
      {
        id: "q2",
        courseId: "c-python",
        question: "What is the output of: print(type([]))?",
        options: ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"],
        correct: 1,
      },
      {
        id: "q3",
        courseId: "c-python",
        question: "Which of these is NOT a Python data type?",
        options: ["int", "str", "char", "float"],
        correct: 2,
      },
      {
        id: "q4",
        courseId: "c-python",
        question: "How do you start a comment in Python?",
        options: ["//", "/*", "#", "<!--"],
        correct: 2,
      },
      {
        id: "q5",
        courseId: "c-python",
        question: "Which symbol is used for exponentiation in Python?",
        options: ["^", "**", "//", "exp"],
        correct: 1,
      },
      {
        id: "q6",
        courseId: "c-web",
        question: "What does HTML stand for?",
        options: ["HyperText Markup Language", "HighText Machine Language", "Hyperlinks Text Mark Language", "Home Tool Markup Language"],
        correct: 0,
      },
      {
        id: "q7",
        courseId: "c-web",
        question: "Which tag is used for the largest heading in HTML?",
        options: ["<head>", "<h6>", "<h1>", "<heading>"],
        correct: 2,
      },
      {
        id: "q8",
        courseId: "c-web",
        question: "Which language is used for styling web pages?",
        options: ["HTML", "CSS", "Python", "SQL"],
        correct: 1,
      },
      {
        id: "q9",
        courseId: "c-web",
        question: "Inside which HTML element do we put JavaScript?",
        options: ["<js>", "<javascript>", "<script>", "<code>"],
        correct: 2,
      },
      {
        id: "q10",
        courseId: "c-data",
        question: "Which library is commonly used for data analysis in Python?",
        options: ["NumPy", "Pandas", "Matplotlib", "Flask"],
        correct: 1,
      },
      {
        id: "q11",
        courseId: "c-data",
        question: "What does CSV stand for?",
        options: ["Comma Separated Values", "Common Style Values", "Computer Software Values", "Code Style Values"],
        correct: 0,
      },
      {
        id: "q12",
        courseId: "c-data",
        question: "Which chart type is best for showing trends over time?",
        options: ["Pie chart", "Bar chart", "Line chart", "Scatter plot"],
        correct: 2,
      },
    ];
    save(KEYS.QUESTIONS, questions);
  }

  if (!load(KEYS.ENROLLMENTS, null)) save(KEYS.ENROLLMENTS, []);
  if (!load(KEYS.PROGRESS, null)) save(KEYS.PROGRESS, {});
  if (!load(KEYS.RESULTS, null)) save(KEYS.RESULTS, []);
  if (!load(KEYS.REQUIREMENTS, null)) save(KEYS.REQUIREMENTS, []);
  if (!load(KEYS.APPLICATIONS, null)) save(KEYS.APPLICATIONS, []);
  if (!load(KEYS.NOTIFICATIONS, null)) save(KEYS.NOTIFICATIONS, []);
}

/* ---------- Auth helpers ---------- */
function getCurrentUser() {
  return load(KEYS.CURRENT, null);
}
function setCurrentUser(user) {
  save(KEYS.CURRENT, user);
}
function logout() {
  localStorage.removeItem(KEYS.CURRENT);
  window.location.href = "login.html";
}
function requireRole(role) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  if (role && user.role !== role) {
    redirectByRole(user.role);
    return null;
  }
  return user;
}
function redirectByRole(role) {
  const map = { trainee: "trainee-dashboard.html", trainer: "trainer-dashboard.html", admin: "admin-dashboard.html" };
  window.location.href = map[role] || "login.html";
}

/* ---------- Data accessors ---------- */
function getUsers() { return load(KEYS.USERS, []); }
function getCourses() { return load(KEYS.COURSES, []); }
function getEnrollments() { return load(KEYS.ENROLLMENTS, []); }
function getProgress() { return load(KEYS.PROGRESS, {}); }
function getQuestions() { return load(KEYS.QUESTIONS, []); }
function getResults() { return load(KEYS.RESULTS, []); }
function getRequirements() { return load(KEYS.REQUIREMENTS, []); }
function getApplications() { return load(KEYS.APPLICATIONS, []); }
function getNotifications() { return load(KEYS.NOTIFICATIONS, []); }
function addNotification(userId, title, message, type = "info") {
  const notifications = getNotifications();
  notifications.unshift({ id: uid(), userId, title, message, type, read: false, createdAt: new Date().toISOString() });
  save(KEYS.NOTIFICATIONS, notifications);
}
function markNotificationRead(id) {
  const notifications = getNotifications();
  const n = notifications.find(x => x.id === id);
  if (n) { n.read = true; save(KEYS.NOTIFICATIONS, notifications); }
}
function normalizeList(value) {
  return String(value || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
}
function calculateMatchScore(requirement, application) {
  const required = normalizeList(requirement.skills);
  const candidate = normalizeList([application.skills, application.specialization, application.certifications].filter(Boolean).join(","));
  let skillScore = required.length ? required.filter(skill => candidate.some(c => c === skill || c.includes(skill) || skill.includes(c))).length / required.length * 55 : 55;
  const qualification = String(application.qualification || "").toLowerCase();
  const reqQualification = String(requirement.qualification || "").toLowerCase();
  const qualificationScore = reqQualification && qualification && (qualification.includes(reqQualification) || reqQualification.split(/[\/|,]/).some(q => q.trim() && qualification.includes(q.trim()))) ? 15 : 0;
  const years = parseFloat(String(application.totalExperience || "0").replace(/[^0-9.]/g, "")) || 0;
  const minYears = parseFloat(String(requirement.minExperience || "0").replace(/[^0-9.]/g, "")) || 0;
  const expScore = minYears <= 0 ? 15 : Math.min(15, Math.round((years / minYears) * 15));
  const relevant = parseFloat(String(application.relevantTrainingExperience || "0").replace(/[^0-9.]/g, "")) || 0;
  const relevantScore = relevant > 0 ? Math.min(10, relevant * 2) : 0;
  return Math.max(0, Math.min(100, Math.round(skillScore + qualificationScore + expScore + relevantScore + 5)));
}
function getApplicationsForRequirement(requirementId) {
  return getApplications().filter(a => a.requirementId === requirementId);
}
function getUnreadNotifications(userId) {
  return getNotifications().filter(n => n.userId === userId && !n.read);
}

/* ---------- Course helpers ---------- */
function getCourseById(id) {
  return getCourses().find((c) => c.id === id);
}
function getCoursesByTrainer(trainerId) {
  return getCourses().filter((c) => c.trainerId === trainerId);
}
function getEnrollmentsByUser(userId) {
  return getEnrollments().filter((e) => e.userId === userId);
}
function isEnrolled(userId, courseId) {
  return getEnrollments().some((e) => e.userId === userId && e.courseId === courseId);
}
function enrollUser(userId, courseId) {
  const enrollments = getEnrollments();
  if (enrollments.some((e) => e.userId === userId && e.courseId === courseId)) return false;
  enrollments.push({ id: uid(), userId, courseId, enrolledAt: new Date().toISOString() });
  save(KEYS.ENROLLMENTS, enrollments);
  const progress = getProgress();
  if (!progress[userId]) progress[userId] = {};
  if (!progress[userId][courseId]) progress[userId][courseId] = { completed: 0, total: 3, lessons: [false, false, false] };
  save(KEYS.PROGRESS, progress);
  return true;
}
function getCourseProgress(userId, courseId) {
  const progress = getProgress();
  if (!progress[userId] || !progress[userId][courseId]) return 0;
  const p = progress[userId][courseId];
  return Math.round((p.completed / p.total) * 100);
}
function markLessonComplete(userId, courseId, lessonIndex) {
  const progress = getProgress();
  if (!progress[userId]) progress[userId] = {};
  if (!progress[userId][courseId]) progress[userId][courseId] = { completed: 0, total: 3, lessons: [false, false, false] };
  if (!progress[userId][courseId].lessons[lessonIndex]) {
    progress[userId][courseId].lessons[lessonIndex] = true;
    progress[userId][courseId].completed = Math.min(progress[userId][courseId].total, progress[userId][courseId].completed + 1);
    save(KEYS.PROGRESS, progress);
  }
}
function getQuestionsByCourse(courseId) {
  return getQuestions().filter((q) => q.courseId === courseId);
}
function saveResult(result) {
  const results = getResults();
  results.push(result);
  save(KEYS.RESULTS, results);
}
function getResultsByUser(userId) {
  return getResults().filter((r) => r.userId === userId);
}

/* ---------- UI helpers ---------- */
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
function difficultyClass(level) {
  const map = { Beginner: "badge-success", Intermediate: "badge-warning", Advanced: "badge-error" };
  return map[level] || "badge-neutral";
}

function courseCardHTML(course, action, userId) {
  if (action === "enroll" && userId) {
    return `
      <div class="course-card">
        <div class="course-icon">${course.icon || "📘"}</div>
        <h3>${escapeHtml(course.title)}</h3>
        <p class="course-desc">${escapeHtml(course.description)}</p>
        <div class="course-meta">
          <span class="badge ${difficultyClass(course.difficulty)}">${course.difficulty}</span>
          <span class="badge badge-neutral">${escapeHtml(course.trainerName)}</span>
          <span class="badge badge-neutral">${course.duration || ""}</span>
        </div>
        <button class="btn btn-primary btn-block" data-enroll="${course.id}">Enroll Now</button>
      </div>`;
  }
  return `
    <div class="course-card">
      <div class="course-icon">${course.icon || "📘"}</div>
      <h3>${escapeHtml(course.title)}</h3>
      <p class="course-desc">${escapeHtml(course.description)}</p>
      <div class="course-meta">
        <span class="badge ${difficultyClass(course.difficulty)}">${course.difficulty}</span>
        <span class="badge badge-neutral">${escapeHtml(course.trainerName)}</span>
      </div>
      <a href="course-details.html?id=${course.id}" class="btn btn-primary btn-block">View Course</a>
    </div>`;
}

/* ============================================================
   PAGE: LOGIN
   ============================================================ */
function initLogin() {
  seedData();
  const form = document.getElementById("loginForm");
  const toggle = document.getElementById("togglePassword");
  const pwd = document.getElementById("password");
  toggle.addEventListener("click", () => {
    const isPwd = pwd.type === "password";
    pwd.type = isPwd ? "text" : "password";
    toggle.textContent = isPwd ? "🙈" : "👁";
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;
    const errorEl = document.getElementById("loginError");
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      errorEl.textContent = "Invalid email or password.";
      errorEl.classList.add("show");
      return;
    }
    if (user.role === "trainer" && user.status !== "approved") {
      errorEl.textContent = "Your trainer account is pending admin approval.";
      errorEl.classList.add("show");
      return;
    }
    if (remember) {
      setCurrentUser(user);
    } else {
      setCurrentUser(user);
    }
    redirectByRole(user.role);
  });
}

/* ============================================================
   PAGE: REGISTER
   ============================================================ */
function initRegister() {
  seedData();
  const form = document.getElementById("registerForm");
  const toggle = document.getElementById("togglePassword");
  const pwd = document.getElementById("password");
  toggle.addEventListener("click", () => {
    const isPwd = pwd.type === "password";
    pwd.type = isPwd ? "text" : "password";
    toggle.textContent = isPwd ? "🙈" : "👁";
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;
    const errorEl = document.getElementById("registerError");
    if (password !== confirm) {
      errorEl.textContent = "Passwords do not match.";
      errorEl.classList.add("show");
      return;
    }
    if (password.length < 6) {
      errorEl.textContent = "Password must be at least 6 characters.";
      errorEl.classList.add("show");
      return;
    }
    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      errorEl.textContent = "An account with this email already exists.";
      errorEl.classList.add("show");
      return;
    }
    const newUser = {
      id: uid(),
      name,
      email,
      password,
      role,
      status: role === "trainer" ? "pending" : "approved",
    };
    users.push(newUser);
    save(KEYS.USERS, users);
    const successEl = document.getElementById("registerSuccess");
    successEl.textContent = role === "trainer"
      ? "Registration successful! Your trainer account is pending admin approval."
      : "Registration successful! You can now log in.";
    successEl.classList.add("show");
    errorEl.classList.remove("show");
    form.reset();
    setTimeout(() => { window.location.href = "login.html"; }, 2500);
  });
}

/* ============================================================
   PAGE: TRAINEE DASHBOARD
   ============================================================ */
function initTraineeDashboard() {
  const user = requireRole("trainee");
  if (!user) return;
  document.getElementById("userName").textContent = user.name;

  const enrollments = getEnrollmentsByUser(user.id);
  const courses = getCourses();
  const results = getResultsByUser(user.id);

  const enrolledCourseIds = enrollments.map((e) => e.courseId);
  const myCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  const completedCourses = myCourses.filter((c) => getCourseProgress(user.id, c.id) === 100);
  const pendingAssessments = myCourses.filter((c) => {
    const hasResults = results.some((r) => r.courseId === c.id);
    return !hasResults && getQuestionsByCourse(c.id).length > 0;
  });
  const avgScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
    : 0;

  document.getElementById("statMyCourses").textContent = myCourses.length;
  document.getElementById("statCompleted").textContent = completedCourses.length;
  document.getElementById("statPending").textContent = pendingAssessments.length;
  document.getElementById("statAvgScore").textContent = avgScore + "%";

  renderTraineeAvailableCourses(user);
  renderTraineeMyCourses(user);
}

function renderTraineeAvailableCourses(user) {
  const container = document.getElementById("availableCourses");
  const courses = getCourses();
  const enrolled = getEnrollmentsByUser(user.id).map((e) => e.courseId);
  const available = courses.filter((c) => !enrolled.includes(c.id));
  if (available.length === 0) {
    container.innerHTML = '<p class="empty-state">You are enrolled in all available courses.</p>';
    return;
  }
  container.innerHTML = available.map((c) => courseCardHTML(c, "enroll", user.id)).join("");
  container.querySelectorAll("[data-enroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      enrollUser(user.id, btn.dataset.enroll);
      renderTraineeAvailableCourses(user);
      renderTraineeMyCourses(user);
      const stats = recomputeTraineeStats(user);
      document.getElementById("statMyCourses").textContent = stats.myCourses;
    });
  });
}

function renderTraineeMyCourses(user) {
  const container = document.getElementById("myCourses");
  const enrollments = getEnrollmentsByUser(user.id);
  const courses = getCourses().filter((c) => enrollments.some((e) => e.courseId === c.id));
  if (courses.length === 0) {
    container.innerHTML = '<p class="empty-state">You have not enrolled in any courses yet. Enroll from the Available Courses section above.</p>';
    return;
  }
  container.innerHTML = courses.map((c) => {
    const pct = getCourseProgress(user.id, c.id);
    return `
      <div class="course-card">
        <div class="course-icon">${c.icon || "📘"}</div>
        <h3>${escapeHtml(c.title)}</h3>
        <p class="course-desc">${escapeHtml(c.description)}</p>
        <div class="course-meta">
          <span class="badge ${difficultyClass(c.difficulty)}">${c.difficulty}</span>
          <span class="badge badge-neutral">${escapeHtml(c.trainerName)}</span>
        </div>
        <div class="progress-section">
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <span class="progress-label">${pct}%</span>
        </div>
        <a href="course-details.html?id=${c.id}" class="btn btn-primary btn-block">Continue Learning</a>
      </div>`;
  }).join("");
}

function recomputeTraineeStats(user) {
  const enrollments = getEnrollmentsByUser(user.id);
  const courses = getCourses();
  const enrolledCourseIds = enrollments.map((e) => e.courseId);
  const myCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  return { myCourses: myCourses.length };
}

/* ============================================================
   PAGE: COURSES (trainee browse all)
   ============================================================ */
function initCoursesPage() {
  const user = requireRole("trainee");
  if (!user) return;
  document.getElementById("userName").textContent = user.name;
  const container = document.getElementById("coursesList");
  const courses = getCourses();
  const enrolled = getEnrollmentsByUser(user.id).map((e) => e.courseId);
  container.innerHTML = courses.map((c) => {
    const isEn = enrolled.includes(c.id);
    return `
      <div class="course-card">
        <div class="course-icon">${c.icon || "📘"}</div>
        <h3>${escapeHtml(c.title)}</h3>
        <p class="course-desc">${escapeHtml(c.description)}</p>
        <div class="course-meta">
          <span class="badge ${difficultyClass(c.difficulty)}">${c.difficulty}</span>
          <span class="badge badge-neutral">${escapeHtml(c.trainerName)}</span>
          <span class="badge badge-neutral">${c.duration || ""}</span>
        </div>
        ${isEn
          ? `<a href="course-details.html?id=${c.id}" class="btn btn-primary btn-block">Continue Learning</a>`
          : `<button class="btn btn-primary btn-block" data-enroll="${c.id}">Enroll Now</button>`}
      </div>`;
  }).join("");
  container.querySelectorAll("[data-enroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      enrollUser(user.id, btn.dataset.enroll);
      initCoursesPage();
    });
  });
}

/* ============================================================
   PAGE: COURSE DETAILS
   ============================================================ */
function initCourseDetails() {
  const user = requireRole("trainee");
  if (!user) return;
  document.getElementById("userName").textContent = user.name;
  const courseId = getQueryParam("id");
  const course = getCourseById(courseId);
  if (!course) {
    document.getElementById("courseContent").innerHTML = '<p class="empty-state">Course not found.</p>';
    return;
  }
  document.getElementById("courseTitle").textContent = course.title;
  document.getElementById("courseDescription").textContent = course.description;
  document.getElementById("courseTrainer").textContent = course.trainerName;
  document.getElementById("courseDifficulty").textContent = course.difficulty;
  document.getElementById("courseDuration").textContent = course.duration || "Self-paced";

  if (!isEnrolled(user.id, courseId)) {
    const enrollBtn = document.getElementById("enrollBtn");
    enrollBtn.style.display = "block";
    enrollBtn.addEventListener("click", () => {
      enrollUser(user.id, courseId);
      window.location.reload();
    });
    document.getElementById("lessonsSection").style.display = "none";
    return;
  }

  const progress = getProgress();
  const p = (progress[user.id] && progress[user.id][courseId]) || { completed: 0, total: 3, lessons: [false, false, false] };
  const pct = Math.round((p.completed / p.total) * 100);
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("progressText").textContent = pct + "%";

  const lessons = [
    { title: "Video Lesson", icon: "🎬", desc: "Watch the introductory video for this module." },
    { title: "PDF Material", icon: "📄", desc: "Read the supplementary PDF material for deeper understanding." },
    { title: "Presentation", icon: "🖥", desc: "Review the slide deck covering key concepts." },
  ];
  const lessonsContainer = document.getElementById("lessonsList");
  lessonsContainer.innerHTML = lessons.map((l, i) => `
    <div class="lesson-card ${p.lessons[i] ? "lesson-done" : ""}">
      <div class="lesson-icon">${l.icon}</div>
      <div class="lesson-info">
        <h4>${l.title}</h4>
        <p>${l.desc}</p>
      </div>
      ${p.lessons[i]
        ? '<span class="badge badge-success">Completed</span>'
        : `<button class="btn btn-sm btn-primary" data-lesson="${i}">Mark as Completed</button>`}
    </div>`).join("");

  lessonsContainer.querySelectorAll("[data-lesson]").forEach((btn) => {
    btn.addEventListener("click", () => {
      markLessonComplete(user.id, courseId, parseInt(btn.dataset.lesson));
      initCourseDetails();
    });
  });

  const questions = getQuestionsByCourse(courseId);
  const assessmentSection = document.getElementById("assessmentSection");
  if (questions.length > 0) {
    assessmentSection.style.display = "block";
    const hasResult = getResultsByUser(user.id).some((r) => r.courseId === courseId);
    if (hasResult) {
      const lastResult = getResultsByUser(user.id).filter((r) => r.courseId === courseId).pop();
      assessmentSection.innerHTML = `
        <h3>Assessment</h3>
        <p class="result-banner">You have completed this assessment. Score: ${lastResult.score}/${lastResult.total} (${lastResult.percentage}%)</p>
        <a href="assessment.html?id=${courseId}" class="btn btn-primary">Retake Assessment</a>`;
    } else {
      assessmentSection.innerHTML = `
        <h3>Assessment</h3>
        <p>Test your knowledge with ${questions.length} questions.</p>
        <a href="assessment.html?id=${courseId}" class="btn btn-primary">Start Assessment</a>`;
    }
  }
}

/* ============================================================
   PAGE: ASSESSMENT
   ============================================================ */
function initAssessment() {
  const user = requireRole("trainee");
  if (!user) return;
  document.getElementById("userName").textContent = user.name;
  const courseId = getQueryParam("id");
  const course = getCourseById(courseId);
  if (!course) {
    document.getElementById("assessmentContent").innerHTML = '<p class="empty-state">Course not found.</p>';
    return;
  }
  document.getElementById("assessmentTitle").textContent = course.title + " — Assessment";
  const questions = getQuestionsByCourse(courseId);
  if (questions.length === 0) {
    document.getElementById("assessmentContent").innerHTML = '<p class="empty-state">No questions available for this course yet.</p>';
    return;
  }
  const form = document.getElementById("assessmentForm");
  form.innerHTML = questions.map((q, qi) => `
    <div class="question-card">
      <h4>Q${qi + 1}. ${escapeHtml(q.question)}</h4>
      <div class="options">
        ${q.options.map((opt, oi) => `
          <label class="option">
            <input type="radio" name="q${q.id}" value="${oi}" required>
            <span>${escapeHtml(opt)}</span>
          </label>`).join("")}
      </div>
    </div>`).join("") + '<button type="submit" class="btn btn-primary btn-block">Submit Test</button>';

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let score = 0;
    questions.forEach((q) => {
      const selected = form.querySelector(`input[name="q${q.id}"]:checked`);
      if (selected && parseInt(selected.value) === q.correct) score++;
    });
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    saveResult({ id: uid(), userId: user.id, courseId, score, total, percentage, takenAt: new Date().toISOString() });

    const resultsHTML = questions.map((q, qi) => {
      const selected = form.querySelector(`input[name="q${q.id}"]:checked`);
      const selIdx = selected ? parseInt(selected.value) : -1;
      const isCorrect = selIdx === q.correct;
      return `
        <div class="result-question ${isCorrect ? "result-correct" : "result-wrong"}">
          <h4>Q${qi + 1}. ${escapeHtml(q.question)}</h4>
          <p><strong>Your answer:</strong> ${selIdx >= 0 ? escapeHtml(q.options[selIdx]) : "Not answered"}</p>
          ${!isCorrect ? `<p><strong>Correct answer:</strong> ${escapeHtml(q.options[q.correct])}</p>` : ""}
          <span class="badge ${isCorrect ? "badge-success" : "badge-error"}">${isCorrect ? "Correct" : "Incorrect"}</span>
        </div>`;
    }).join("");

    document.getElementById("assessmentContent").innerHTML = `
      <div class="score-banner ${percentage >= 60 ? "score-pass" : "score-fail"}">
        <h2>Score: ${score}/${total}</h2>
        <p>Percentage: ${percentage}%</p>
        <p>${percentage >= 60 ? "Congratulations! You passed." : "Keep practicing. You can retake this assessment."}</p>
      </div>
      <a href="course-details.html?id=${courseId}" class="btn btn-primary">Back to Course</a>
      <h3 style="margin-top:2rem;">Review Answers</h3>
      ${resultsHTML}`;
  });
}

/* ============================================================
   PAGE: TRAINER DASHBOARD
   ============================================================ */
function initTrainerDashboard() {
  const user = requireRole("trainer");
  if (!user) return;
  document.getElementById("userName").textContent = user.name;

  refreshTrainerStats(user);
  renderTrainerCourses(user);
  renderTrainerQuestions(user);

  const courseForm = document.getElementById("createCourseForm");
  courseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("courseTitle").value.trim();
    const description = document.getElementById("courseDescription").value.trim();
    const subject = document.getElementById("courseSubject").value.trim();
    const difficulty = document.getElementById("courseDifficulty").value;
    const duration = document.getElementById("courseDuration").value.trim();
    const courses = getCourses();
    const newCourse = {
      id: uid(),
      title,
      description,
      subject,
      difficulty,
      duration,
      trainerId: user.id,
      trainerName: user.name,
      icon: "📘",
    };
    courses.push(newCourse);
    save(KEYS.COURSES, courses);
    courseForm.reset();
    renderTrainerCourses(user);
    refreshTrainerStats(user);
  });

  const mcqForm = document.getElementById("createMcqForm");
  mcqForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const courseId = document.getElementById("mcqCourse").value;
    const question = document.getElementById("mcqQuestion").value.trim();
    const opt1 = document.getElementById("mcqOpt1").value.trim();
    const opt2 = document.getElementById("mcqOpt2").value.trim();
    const opt3 = document.getElementById("mcqOpt3").value.trim();
    const opt4 = document.getElementById("mcqOpt4").value.trim();
    const correct = parseInt(document.getElementById("mcqCorrect").value);
    const questions = getQuestions();
    questions.push({ id: uid(), courseId, question, options: [opt1, opt2, opt3, opt4], correct });
    save(KEYS.QUESTIONS, questions);
    mcqForm.reset();
    renderTrainerQuestions(user);
    refreshTrainerStats(user);
  });

  populateMcqCourseDropdown(user);
  initTrainerHiring(user);
  refreshTrainerHiringStats(user);
}

function initTrainerHiring(user) {
  const requirementsContainer = document.getElementById("trainerRequirementsList");
  const applicationsContainer = document.getElementById("trainerApplicationsList");
  const notificationContainer = document.getElementById("trainerNotifications");
  if (!requirementsContainer || !applicationsContainer) return;
  renderTrainerRequirements(user);
  renderTrainerApplications(user);
  renderNotifications(user, notificationContainer);
  requirementsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-apply-requirement]");
    if (!btn) return;
    openTrainerApplicationModal(btn.dataset.applyRequirement, user);
  });
  applicationsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view-application]");
    if (!btn) return;
    const a = getApplications().find(x => x.id === btn.dataset.viewApplication);
    if (a) alert(`Application Details\\n\\nRole: ${a.requirementTitle}\\nStatus: ${a.status}\\nQualification: ${a.qualification}\\nExperience: ${a.totalExperience}\\nSkills: ${a.skills}\\nSummary: ${a.summary}`);
  });
}

function renderTrainerRequirements(user) {
  const container = document.getElementById("trainerRequirementsList");
  if (!container) return;
  const apps = getApplications().filter(a => a.trainerId === user.id);
  const active = getRequirements().filter(r => r.status === "Active" && !apps.some(a => a.requirementId === r.id));
  if (!active.length) { container.innerHTML = '<p class="empty-state">No new trainer opportunities are available right now.</p>'; return; }
  container.innerHTML = active.map(r => `
    <div class="hiring-card">
      <div class="hiring-card-head"><div><span class="badge badge-success">${escapeHtml(r.status)}</span><h3>${escapeHtml(r.title)}</h3></div><span class="match-pill">${r.trainersRequired} trainer${r.trainersRequired > 1 ? "s" : ""} needed</span></div>
      <p>${escapeHtml(r.description || "Training requirement")}</p>
      <div class="hiring-meta"><span>🎯 ${escapeHtml(r.skills)}</span><span>🎓 ${escapeHtml(r.qualification)}</span><span>💼 ${escapeHtml(r.minExperience)}+ yrs</span><span>⏱ ${escapeHtml(r.duration)}</span><span>📅 ${escapeHtml(r.startDate)}</span></div>
      <div class="hiring-actions"><button class="btn btn-primary" data-apply-requirement="${r.id}">View Details & Apply</button></div>
    </div>`).join("");
}

function renderTrainerApplications(user) {
  const container = document.getElementById("trainerApplicationsList");
  if (!container) return;
  const apps = getApplications().filter(a => a.trainerId === user.id);
  if (!apps.length) { container.innerHTML = '<p class="empty-state">You have not applied to any trainer requirements yet.</p>'; return; }
  container.innerHTML = apps.map(a => `
    <div class="application-row">
      <div><h3>${escapeHtml(a.requirementTitle)}</h3><p>Applied ${new Date(a.appliedAt).toLocaleDateString()} · ${escapeHtml(a.email)}</p></div>
      <span class="status-badge status-${a.status.toLowerCase().replace(/ /g,'-')}">${escapeHtml(a.status)}</span>
      <button class="btn btn-sm btn-secondary" data-view-application="${a.id}">View Submission</button>
    </div>`).join("");
}

function openTrainerApplicationModal(requirementId, user) {
  const r = getRequirements().find(x => x.id === requirementId);
  if (!r) return;
  const existing = getApplications().some(a => a.requirementId === requirementId && a.trainerId === user.id);
  if (existing) { alert("You have already submitted an application for this requirement."); return; }
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `<div class="modal-card modal-large"><div class="modal-head"><div><span class="badge badge-primary">Trainer Opportunity</span><h2>${escapeHtml(r.title)}</h2></div><button class="modal-close" aria-label="Close">×</button></div>
    <div class="hiring-detail"><p>${escapeHtml(r.description || "")}</p><div class="hiring-meta"><span>🎯 ${escapeHtml(r.skills)}</span><span>🎓 ${escapeHtml(r.qualification)}</span><span>💼 ${escapeHtml(r.minExperience)}+ yrs</span><span>⏱ ${escapeHtml(r.duration)}</span><span>📅 ${escapeHtml(r.startDate)}</span></div></div>
    <form id="trainerApplicationForm" class="dashboard-form"><div class="form-grid-2"><div class="form-group"><label>Full Name</label><input id="appName" value="${escapeHtml(user.name)}" required></div><div class="form-group"><label>Email</label><input id="appEmail" type="email" value="${escapeHtml(user.email)}" required></div></div>
    <div class="form-grid-2"><div class="form-group"><label>Phone</label><input id="appPhone" required></div><div class="form-group"><label>Qualification</label><input id="appQualification" placeholder="B.Tech / MCA / M.Tech" required></div></div>
    <div class="form-grid-2"><div class="form-group"><label>Specialization</label><input id="appSpecialization" required></div><div class="form-group"><label>Total Experience</label><input id="appExperience" placeholder="e.g. 4 years" required></div></div>
    <div class="form-grid-2"><div class="form-group"><label>Relevant Training Experience</label><input id="appRelevant" placeholder="e.g. 3 years"></div><div class="form-group"><label>Certifications</label><input id="appCertifications" placeholder="Comma separated"></div></div>
    <div class="form-group"><label>Skills / Competencies</label><input id="appSkills" placeholder="Python, Machine Learning, Data Science" required></div>
    <div class="form-group"><label>Previous Organizations / Institutions</label><input id="appOrganizations"></div>
    <div class="form-group"><label>Short Professional Summary</label><textarea id="appSummary" required></textarea></div>
    <div class="form-grid-2"><div class="form-group"><label>Resume Upload</label><input id="appResume" type="file" accept=".pdf,.doc,.docx" required></div><div class="form-group"><label>Supporting Documents (optional)</label><input id="appDocs" type="file" multiple></div></div>
    <div class="modal-actions"><button type="button" class="btn btn-secondary modal-cancel">Cancel</button><button type="submit" class="btn btn-primary">Submit Application</button></div></form></div>`;
  document.body.appendChild(modal);
  const close = () => modal.remove();
  modal.querySelector(".modal-close").onclick = close; modal.querySelector(".modal-cancel").onclick = close;
  modal.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    if (!confirm("Please confirm that the information and resume you provided are correct. Submit application?")) return;
    const resume = document.getElementById("appResume").files[0];
    const supporting = Array.from(document.getElementById("appDocs").files || []);
    const buildApplication = (resumeData = "") => {
      const app = { id: uid(), requirementId: r.id, requirementTitle: r.title, trainerId: user.id, name: document.getElementById("appName").value.trim(), email: document.getElementById("appEmail").value.trim(), phone: document.getElementById("appPhone").value.trim(), qualification: document.getElementById("appQualification").value.trim(), specialization: document.getElementById("appSpecialization").value.trim(), totalExperience: document.getElementById("appExperience").value.trim(), relevantTrainingExperience: document.getElementById("appRelevant").value.trim(), skills: document.getElementById("appSkills").value.trim(), certifications: document.getElementById("appCertifications").value.trim(), organizations: document.getElementById("appOrganizations").value.trim(), summary: document.getElementById("appSummary").value.trim(), resumeName: resume ? resume.name : "", resumeData, supportingDocuments: supporting.map(f => f.name), status: "Submitted", appliedAt: new Date().toISOString(), matchScore: 0 };
      app.matchScore = calculateMatchScore(r, app);
      const applications = getApplications(); applications.push(app); save(KEYS.APPLICATIONS, applications);
      addNotification("u-admin", "New Trainer Application", `${app.name} has applied for the ${r.title} requirement.`, "application");
      alert("Application Submitted Successfully"); close(); renderTrainerRequirements(user); renderTrainerApplications(user); refreshTrainerHiringStats(user); renderNotifications(user, document.getElementById("trainerNotifications"));
    };
    if (resume) { const reader = new FileReader(); reader.onload = () => buildApplication(reader.result); reader.readAsDataURL(resume); } else buildApplication();
  };
}

function refreshTrainerHiringStats(user) {
  const el = document.getElementById("statTrainerApplications"); if (el) el.textContent = getApplications().filter(a => a.trainerId === user.id).length;
}

function renderNotifications(user, container) {
  if (!container) return;
  const notifications = getNotifications().filter(n => n.userId === user.id).slice(0, 8);
  const count = document.getElementById("notificationCount"); if (count) { const unread = notifications.filter(n => !n.read).length; count.textContent = unread; count.style.display = unread ? "inline-flex" : "none"; }
  container.innerHTML = notifications.length ? notifications.map(n => `<div class="notification-item ${n.read ? "read" : "unread"}" data-notification="${n.id}"><strong>🔔 ${escapeHtml(n.title)}</strong><p>${escapeHtml(n.message)}</p><small>${new Date(n.createdAt).toLocaleString()}</small></div>`).join("") : '<p class="empty-state">No notifications.</p>';
  container.querySelectorAll("[data-notification]").forEach(x => x.onclick = () => { markNotificationRead(x.dataset.notification); renderNotifications(user, container); });
}

function populateMcqCourseDropdown(user) {
  const select = document.getElementById("mcqCourse");
  if (!select) return;
  const courses = getCoursesByTrainer(user.id);
  select.innerHTML = '<option value="">Select a course...</option>' +
    courses.map((c) => `<option value="${c.id}">${escapeHtml(c.title)}</option>`).join("");
}

function refreshTrainerStats(user) {
  const myCourses = getCoursesByTrainer(user.id);
  const enrollments = getEnrollments();
  const myCourseIds = myCourses.map((c) => c.id);
  const totalStudents = new Set(enrollments.filter((e) => myCourseIds.includes(e.courseId)).map((e) => e.userId)).size;
  const assessments = getQuestions().filter((q) => myCourseIds.includes(q.courseId)).length;
  const results = getResults().filter((r) => myCourseIds.includes(r.courseId));
  const avgScore = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;
  document.getElementById("statMyCourses").textContent = myCourses.length;
  document.getElementById("statStudents").textContent = totalStudents;
  document.getElementById("statAssessments").textContent = assessments;
  document.getElementById("statAvgScore").textContent = avgScore + "%";
}

function renderTrainerCourses(user) {
  const container = document.getElementById("trainerCourses");
  const courses = getCoursesByTrainer(user.id);
  if (courses.length === 0) {
    container.innerHTML = '<p class="empty-state">You have not created any courses yet. Use the form above to create one.</p>';
    return;
  }
  container.innerHTML = courses.map((c) => {
    const qCount = getQuestionsByCourse(c.id).length;
    const studentCount = getEnrollments().filter((e) => e.courseId === c.id).length;
    return `
      <div class="course-card">
        <div class="course-icon">${c.icon || "📘"}</div>
        <h3>${escapeHtml(c.title)}</h3>
        <p class="course-desc">${escapeHtml(c.description)}</p>
        <div class="course-meta">
          <span class="badge ${difficultyClass(c.difficulty)}">${c.difficulty}</span>
          <span class="badge badge-neutral">${escapeHtml(c.subject)}</span>
          <span class="badge badge-neutral">${c.duration || ""}</span>
        </div>
        <div class="course-stats">
          <span>👥 ${studentCount} students</span>
          <span>❓ ${qCount} questions</span>
        </div>
      </div>`;
  }).join("");
}

function renderTrainerQuestions(user) {
  const container = document.getElementById("trainerQuestions");
  if (!container) return;
  const courses = getCoursesByTrainer(user.id);
  const myCourseIds = courses.map((c) => c.id);
  const questions = getQuestions().filter((q) => myCourseIds.includes(q.courseId));
  if (questions.length === 0) {
    container.innerHTML = '<p class="empty-state">No MCQ questions created yet. Use the form above to add questions.</p>';
    return;
  }
  container.innerHTML = questions.map((q, i) => {
    const course = courses.find((c) => c.id === q.courseId);
    return `
      <div class="question-row">
        <div>
          <strong>Q${i + 1}.</strong> ${escapeHtml(q.question)}
          <div class="question-meta">Course: ${escapeHtml(course ? course.title : "Unknown")} | Correct: ${escapeHtml(q.options[q.correct])}</div>
        </div>
        <button class="btn btn-sm btn-danger" data-del-q="${q.id}">Delete</button>
      </div>`;
  }).join("");
  container.querySelectorAll("[data-del-q]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const questions = getQuestions().filter((q) => q.id !== btn.dataset.delQ);
      save(KEYS.QUESTIONS, questions);
      renderTrainerQuestions(user);
      refreshTrainerStats(user);
    });
  });
}

/* ============================================================
   PAGE: ADMIN DASHBOARD
   ============================================================ */
function initAdminDashboard() {
  const user = requireRole("admin");
  if (!user) return;
  document.getElementById("userName").textContent = user.name;
  refreshAdminStats();
  renderAdminUsers();
  initAdminHiring(user);
}

function initAdminHiring(user) {
  renderRequirementsAdmin(); renderNotifications(user, document.getElementById("adminNotifications"));
  const form = document.getElementById("trainerRequirementForm");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const requirement = { id: uid(), title: document.getElementById("reqTitle").value.trim(), course: document.getElementById("reqCourse").value.trim(), skills: document.getElementById("reqSkills").value.trim(), qualification: document.getElementById("reqQualification").value.trim(), minExperience: document.getElementById("reqMinExperience").value.trim(), preferredExperience: document.getElementById("reqPreferredExperience").value.trim(), trainersRequired: parseInt(document.getElementById("reqTrainerCount").value,10) || 1, duration: document.getElementById("reqDuration").value.trim(), startDate: document.getElementById("reqStartDate").value, description: document.getElementById("reqDescription").value.trim(), additional: document.getElementById("reqAdditional").value.trim(), deadline: document.getElementById("reqDeadline").value, status: "Active", createdAt: new Date().toISOString() };
    const requirements = getRequirements(); requirements.unshift(requirement); save(KEYS.REQUIREMENTS, requirements);
    getUsers().filter(u => u.role === "trainer" && u.status === "approved").forEach(t => { addNotification(t.id, "New Trainer Opportunity", `${requirement.title} has been posted. Review the opportunity and apply if suitable.`, "opportunity"); });
    form.reset(); alert("Trainer requirement posted successfully."); renderRequirementsAdmin();
  });
  const list = document.getElementById("adminRequirementsList");
  if (list) list.addEventListener("click", e => {
    const action = e.target.closest("[data-requirement-action]"); if (!action) return;
    const id = action.dataset.id, type = action.dataset.requirementAction;
    if (type === "delete" && confirm("Delete this trainer requirement?")) { save(KEYS.REQUIREMENTS, getRequirements().filter(r => r.id !== id)); renderRequirementsAdmin(); return; }
    if (type === "close") { const rs=getRequirements(); const r=rs.find(x=>x.id===id); if(r){r.status="Closed";save(KEYS.REQUIREMENTS,rs);renderRequirementsAdmin();} return; }
    if (type === "edit") { openRequirementEditModal(id); return; }
    if (type === "applications") { openApplicationsModal(id); return; }
    if (type === "selected") { openApplicationsModal(id, "Selected"); return; }
  });
}

function renderRequirementsAdmin() {
  const container = document.getElementById("adminRequirementsList"); if (!container) return;
  const requirements = getRequirements();
  if (!requirements.length) { container.innerHTML='<p class="empty-state">No trainer requirements posted yet. Create your first requirement above.</p>'; return; }
  container.innerHTML = requirements.map(r => { const apps=getApplicationsForRequirement(r.id); const selected=apps.filter(a=>a.status==="Selected").length; const status=selected>=r.trainersRequired?"Filled":r.status; return `<div class="hiring-card"><div class="hiring-card-head"><div><span class="badge ${status==="Active"?"badge-success":status==="Filled"?"badge-primary":"badge-neutral"}">${status}</span><h3>${escapeHtml(r.title)}</h3></div><span class="match-pill">${selected}/${r.trainersRequired} selected</span></div><div class="hiring-meta"><span>🎯 ${escapeHtml(r.skills)}</span><span>🎓 ${escapeHtml(r.qualification)}</span><span>💼 ${escapeHtml(r.minExperience)}+ yrs</span><span>👥 ${apps.length} applications</span></div><p>${escapeHtml(r.description || "")}</p><div class="hiring-actions"><button class="btn btn-sm btn-primary" data-requirement-action="applications" data-id="${r.id}">View Applications</button><button class="btn btn-sm btn-secondary" data-requirement-action="selected" data-id="${r.id}">Selected Trainers</button><button class="btn btn-sm btn-secondary" data-requirement-action="edit" data-id="${r.id}">Edit</button>${status==="Active"?`<button class="btn btn-sm btn-warning" data-requirement-action="close" data-id="${r.id}">Close</button>`:""}<button class="btn btn-sm btn-danger" data-requirement-action="delete" data-id="${r.id}">Delete</button></div></div>`; }).join("");
}

function openRequirementEditModal(id) {
  const r=getRequirements().find(x=>x.id===id); if(!r)return; const title=prompt("Requirement / Role Title",r.title); if(title===null)return; const skills=prompt("Required Skills",r.skills); if(skills===null)return; const desc=prompt("Description / Job Requirements",r.description||""); const rs=getRequirements(); const x=rs.find(a=>a.id===id); Object.assign(x,{title:title.trim(),skills:skills.trim(),description:desc===null?x.description:desc.trim()}); save(KEYS.REQUIREMENTS,rs); renderRequirementsAdmin();
}

function openApplicationsModal(requirementId, statusFilter = "") {
  const r=getRequirements().find(x=>x.id===requirementId); if(!r)return; let apps=getApplicationsForRequirement(requirementId);
  if (!statusFilter) { const all=getApplications(); let changed=false; all.forEach(a=>{if(a.requirementId===requirementId && a.status==="Submitted"){a.status="Under Review"; changed=true; addNotification(a.trainerId,"Application Under Review",`Your application for ${r.title} is now under review.`);}}); if(changed) save(KEYS.APPLICATIONS,all); }
  apps=getApplicationsForRequirement(requirementId).filter(a => !statusFilter || a.status === statusFilter).sort((a,b)=>b.matchScore-a.matchScore); const modal=document.createElement("div"); modal.className="modal-overlay"; modal.innerHTML=`<div class="modal-card modal-xlarge"><div class="modal-head"><div><span class="badge badge-primary">${apps.length} Applications</span><h2>${escapeHtml(r.title)}</h2></div><button class="modal-close">×</button></div><div class="application-toolbar"><strong>Sort by Match Score: High → Low</strong><span>${r.trainersRequired} trainer${r.trainersRequired>1?'s':''} required</span></div><div id="adminApplicationsRows"></div></div>`; document.body.appendChild(modal); modal.querySelector(".modal-close").onclick=()=>modal.remove();
  const rows=modal.querySelector("#adminApplicationsRows"); if(!apps.length){rows.innerHTML='<p class="empty-state">No applications received yet.</p>';return;}
  rows.innerHTML=apps.map(a=>`<div class="candidate-card"><div class="candidate-main"><div class="candidate-avatar">${escapeHtml((a.name||"T").charAt(0).toUpperCase())}</div><div><h3>${escapeHtml(a.name)}</h3><p>${escapeHtml(a.qualification)} · ${escapeHtml(a.totalExperience)}</p><p>${escapeHtml(a.skills)}</p><small>Applied ${new Date(a.appliedAt).toLocaleDateString()} ${a.resumeName?`· Resume: ${escapeHtml(a.resumeName)}`:""}</small></div></div><div class="candidate-score"><strong>${a.matchScore}%</strong><span>Competency Match</span></div><div class="candidate-status"><span class="status-badge status-${a.status.toLowerCase().replace(/ /g,'-')}">${escapeHtml(a.status)}</span><div class="hiring-actions"><button class="btn btn-sm btn-secondary" data-candidate="profile" data-id="${a.id}">View Profile</button>${a.resumeName?`<button class="btn btn-sm btn-secondary" data-candidate="resume" data-id="${a.id}">View Resume</button>`:""}<button class="btn btn-sm btn-warning" data-candidate="shortlist" data-id="${a.id}">Shortlist</button><button class="btn btn-sm btn-danger" data-candidate="reject" data-id="${a.id}">Reject</button><button class="btn btn-sm btn-success" data-candidate="select" data-id="${a.id}">Select Trainer</button></div></div></div>`).join("");
  rows.addEventListener("click",e=>{const b=e.target.closest("[data-candidate]");if(!b)return;const a=getApplications().find(x=>x.id===b.dataset.id);if(!a)return; if(b.dataset.candidate==="profile"){alert(`Candidate Profile\n\n${a.name}\n${a.qualification}\nSpecialization: ${a.specialization}\nExperience: ${a.totalExperience}\nRelevant Training: ${a.relevantTrainingExperience}\nSkills: ${a.skills}\nCertifications: ${a.certifications||"None"}\nPrevious Organizations: ${a.organizations||"None"}\n\n${a.summary}`);} else if(b.dataset.candidate==="resume"){ if(a.resumeData){ const w=window.open(a.resumeData,"_blank"); if(w) w.document.title=a.resumeName||"Resume"; } else alert(`Resume: ${a.resumeName || "Not available"}`); } else {updateApplicationStatus(a.id,b.dataset.candidate,r,modal);}});
}

function updateApplicationStatus(applicationId, action, requirement, modal) {
  const applications=getApplications(); const a=applications.find(x=>x.id===applicationId); if(!a)return; let status; if(action==="shortlist")status="Shortlisted"; if(action==="reject")status="Rejected"; if(action==="select"){const selected=applications.filter(x=>x.requirementId===requirement.id&&x.status==="Selected").length;if(selected>=requirement.trainersRequired){alert("Required number of trainers has already been selected.");return;} if(!confirm("Are you sure you want to select this trainer for this requirement?"))return; status="Selected";} a.status=status; a.adminDecision=status; save(KEYS.APPLICATIONS,applications); addNotification(a.trainerId, status==="Selected"?"Application Selected":status==="Rejected"?"Application Rejected":"Application Shortlisted", status==="Selected"?`You have been selected for the ${requirement.title} role.`:status==="Rejected"?`Your application for ${requirement.title} was rejected.`:`You have been shortlisted for the ${requirement.title} role.`, "application"); if(status==="Selected"){const selected=applications.filter(x=>x.requirementId===requirement.id&&x.status==="Selected").length;if(selected>=requirement.trainersRequired){const rs=getRequirements();const r=rs.find(x=>x.id===requirement.id);if(r){r.status="Closed";r.filled=true;save(KEYS.REQUIREMENTS,rs);}}} modal.remove(); renderRequirementsAdmin(); setTimeout(()=>openApplicationsModal(requirement.id),0);}

function refreshAdminStats() {
  const users = getUsers();
  const trainees = users.filter((u) => u.role === "trainee");
  const trainers = users.filter((u) => u.role === "trainer");
  const courses = getCourses();
  const enrollments = getEnrollments();
  document.getElementById("statTotalUsers").textContent = users.length;
  document.getElementById("statTrainees").textContent = trainees.length;
  document.getElementById("statTrainers").textContent = trainers.length;
  document.getElementById("statCourses").textContent = courses.length;
  document.getElementById("statEnrollments").textContent = enrollments.length;
}

function renderAdminUsers() {
  const container = document.getElementById("usersTableBody");
  const users = getUsers();
  container.innerHTML = users.map((u) => `
    <tr>
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="badge ${u.role === "admin" ? "badge-primary" : u.role === "trainer" ? "badge-warning" : "badge-neutral"}">${u.role}</span></td>
      <td><span class="badge ${u.status === "approved" ? "badge-success" : "badge-error"}">${u.status}</span></td>
      <td class="action-cell">
        ${u.role === "trainer" && u.status === "pending" ? `<button class="btn btn-sm btn-success" data-approve="${u.id}">Approve</button>` : ""}
        ${u.role !== "admin" ? `<button class="btn btn-sm btn-danger" data-delete="${u.id}">Delete</button>` : ""}
      </td>
    </tr>`).join("");
  container.querySelectorAll("[data-approve]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const users = getUsers();
      const u = users.find((x) => x.id === btn.dataset.approve);
      if (u) {
        u.status = "approved";
        save(KEYS.USERS, users);
        renderAdminUsers();
        refreshAdminStats();
      }
    });
  });
  container.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Are you sure you want to delete this user?")) return;
      const users = getUsers().filter((x) => x.id !== btn.dataset.delete);
      save(KEYS.USERS, users);
      renderAdminUsers();
      refreshAdminStats();
    });
  });
}


/* ---------- Trainee feedback ---------- */
function initFeedback() {
  const user = getCurrentUser();
  if (!user || user.role !== "trainee") {
    window.location.href = "login.html";
    return;
  }

  const form = document.getElementById("feedbackForm");
  const success = document.getElementById("feedbackSuccess");
  const error = document.getElementById("feedbackError");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    error.classList.remove("show");
    success.classList.remove("show");

    const type = form.querySelector('input[name="feedbackType"]:checked')?.value;
    const subject = form.elements.subject.value.trim();
    const course = form.elements.course.value.trim();
    const details = form.elements.details.value.trim();

    if (!type || !subject || !details) {
      error.textContent = "Please select a category and complete the required fields.";
      error.classList.add("show");
      return;
    }

    if (details.length < 10) {
      error.textContent = "Please provide at least 10 characters in the details field.";
      error.classList.add("show");
      return;
    }

    const submissions = load("cc_feedback", []);
    submissions.unshift({
      id: uid(),
      userId: user.id,
      userName: user.name,
      type,
      subject,
      course,
      details,
      createdAt: new Date().toISOString()
    });
    save("cc_feedback", submissions);

    form.reset();
    form.querySelector('input[name="feedbackType"][value="technical"]').checked = true;
    success.classList.add("show");
    success.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

/* ============================================================
   PAGE INITIALIZER
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  seedData();
  const page = document.body.dataset.page;
  switch (page) {
    case "login": initLogin(); break;
    case "register": initRegister(); break;
    case "trainee-dashboard": initTraineeDashboard(); break;
    case "trainer-dashboard": initTrainerDashboard(); break;
    case "admin-dashboard": initAdminDashboard(); break;
    case "courses": initCoursesPage(); break;
    case "course-details": initCourseDetails(); break;
    case "assessment": initAssessment(); break;
    case "feedback": initFeedback(); break;
  }
});
