<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
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
>>>>>>> 5373b10f38b5981121f36cd6a325590abdf94d69
