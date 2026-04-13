# 🚀 CodeSense AI – Client (Frontend)

CodeSense AI is a modern AI-powered code review platform that helps developers analyze code, detect bugs, optimize performance, and improve security.

This repository contains the **frontend (client)** built using **Next.js**, designed with a premium SaaS UI/UX.

---

## 🌟 Features

* 🔐 Authentication (Login / Signup with JWT)
* 🔄 Swipe-style Login & Register UI (Modern UX)
* 🤖 AI Code Review Interface
* 📊 Code Analysis Result Display (Score + Issues)
* 📜 Review History Dashboard
* 🎨 Premium UI (Glassmorphism + Gradient Design)
* ⚡ Smooth Animations (Framer Motion)
* 📱 Fully Responsive Design
* 🔔 Toast Notifications & Error Handling

---

## 🧱 Tech Stack

* ⚛️ Next.js (React Framework)
* 🎨 Tailwind CSS
* 🎬 Framer Motion (Animations)
* 🔐 JWT Authentication
* 🌐 REST API Integration
* 🧠 AI Backend (Groq / OpenAI)

---

## 📂 Project Structure

```
client/
│── src/
│   ├── app/
│   │   ├── page.tsx          # Home Page
│   │   ├── login/            # Login Page
│   │   ├── signup/           # Signup Page
│   │   ├── dashboard/        # Dashboard Pages
│   │   └── review/           # Code Review Page
│   ├── components/           # Reusable UI Components
│   ├── hooks/                # Custom Hooks
│   ├── utils/                # Helper Functions
│   └── styles/               # Global Styles
│
├── public/                   # Static Assets
├── package.json
└── tailwind.config.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/codesense-ai.git
```

---

### 2️⃣ Navigate to Client Folder

```
cd client
```

---

### 3️⃣ Install Dependencies

```
npm install
```

---

### 4️⃣ Configure Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 5️⃣ Run Development Server

```
npm run dev
```

---

## 🌐 Open in Browser

```
http://localhost:3000
```

---

## 🔗 API Integration

The frontend connects to the backend via:

```
http://localhost:5000/api
```

Make sure your backend server is running before testing.

---

## 🔐 Authentication Flow

* User registers / logs in
* JWT token stored in `localStorage`
* Token used for protected API requests
* Logout removes token and redirects to login

---

## 🤖 Code Review Flow

1. User enters or uploads code
2. Clicks **Analyze Code**
3. Request sent to backend
4. AI processes code
5. Results displayed with:

   * Score
   * Issues
   * Suggestions

---

## 🎨 UI Highlights

* 🌌 Dark Theme + Glassmorphism
* 🎯 Clean Layout (No Overlap)
* 🎬 Smooth Animations
* 📱 Fully Responsive
* 🔥 Modern SaaS Design

---

## 🧪 Debug Tips

* Open DevTools (F12)
* Check Console for errors
* Check Network tab for API calls
* Ensure backend is running properly

---

## 🚀 Future Enhancements

* 💻 Monaco Editor (VS Code-like editor)
* 📊 Advanced Analytics Dashboard
* 🌙 Dark/Light Mode Toggle
* 📁 File Upload Support
* 🤖 ChatGPT-style AI Explanation Panel
* 🔐 OAuth Login (Google/GitHub)

---

## 💡 Author

**Samaresh Debnath**

---

🔥 Build. Analyze. Improve.
