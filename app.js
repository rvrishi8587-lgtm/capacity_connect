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
}

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
  }
});
