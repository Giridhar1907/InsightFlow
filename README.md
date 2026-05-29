# 📊 InsightFlow - AI Business Analytics SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-316192?style=for-the-badge&logo=postgresql)](https://supabase.com/)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**InsightFlow** is a premium, production-grade, multi-tenant AI-Powered Analytics SaaS Platform. It empowers growing SaaS teams to upload raw CSV reports, ask complex business metrics questions in plain English, and instantly compile gorgeous interactive Recharts dashboards, automated executive summaries, and granular analytical insights.

---

## ⚡ Architectural Features

### 1. Dual-Engine Database Adapter
Designed for rapid, zero-setup local development while remaining 100% production-ready:
* **Local Development**: Automatically connects to a self-contained local **SQLite** file (`storage/insightflow.db`).
* **Production**: Connects to a highly secure cloud **Supabase PostgreSQL** instance as soon as the `DATABASE_URL` environment variable is defined.
* **SQL Compiler Wrapper**: Implements an custom SQL execution helper that dynamically translates query placeholders (e.g. mapping SQLite's `?` to PostgreSQL's `%s` on the fly), ensuring absolute codebase engine-agnosticism.

### 2. Dual SaaS Mode Toggler (Sandbox vs. Utility)
A perfect addition for portfolio demonstration:
* **SaaS Simulator Mode**: Potential employers can register, check out limit quotas (e.g., Free tier is capped at 3 dataset uploads and 20 AI queries), and experience a sandbox **Stripe Checkout simulation** typing fake cards to purchase Pro upgrades!
* **Developer Bypass Mode**: Switch **"Developer Access ON"** via a glowing toggle in the Navbar to instantly set the active user's SQL tier to Enterprise, granting 1000 credits, unlimited dataset storage, and developer API keys generation.

### 3. AI Conversational Business Analyst
* Connects to a high-speed inference **Groq LLM Pipeline** (`llama-3.3-70b-versatile`) via LangChain.
* Maintains thread-safe session-aware dialogue memory, enabling follow-up questions, trend comparisons, and actionable revenue recommendations.
* Dynamically compiles structured query plans detailing groupings, aggregations (Sum, Mean, Count, Max, Min), and chart formats.

### 4. Interactive Visual Analytics Suite
* Features a gorgeous, custom-styled **Recharts Canvas Engine** supporting Bar, Line, Area, and Pie visualizations.
* Beautiful dark glassmorphism card skins with **Vibrant Indigo-to-Violet Gradients** and legible axis tick fonts.

---

## 📂 Repository Folder Structure

This repository is organized as a clean Monorepo:
```text
InsightFlow/
├── frontend/             # Next.js 16 (App Router, Tailwind CSS, Recharts)
│   ├── app/              # Frontend pages and dashboard routing
│   └── components/       # Premium sidebar, navbar, and charts
├── backend/              # FastAPI API (Python 3.11+, SQLite, PostgreSQL)
│   ├── api/routes/       # Endpoint routers (Auth, Billing, Datasets, Charts)
│   ├── database/         # Database connection managers and schemas
│   ├── services/         # Session-safe memory data stores
│   └── main.py           # Core FastAPI bootstrapper
└── storage/              # Ephemeral uploads and SQLite DB files (local only)
```

---

## 🚀 Quick Start (Local Development)

### 1. Start the Backend Server (FastAPI)
Navigate to the `backend` folder and activate your virtual environment:
```bash
cd backend
..\venv\Scripts\Activate.ps1   # On Windows
source venv/bin/activate       # On macOS/Linux
```
Install dependencies and run the server using `uvicorn`:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
*The backend API will run on **http://localhost:8000** and auto-initialize the SQLite database.*

### 2. Start the Frontend Server (Next.js)
Navigate to the `frontend` folder, install packages, and boot the web dev server:
```bash
cd ../frontend
npm install
npm run dev
```
*The web dashboard playground will launch on **http://localhost:3000**.*

---

## 🌐 Production Cloud Deployment

### 1. Database Setup (Supabase)
1. Register a free account on [Supabase.com](https://supabase.com).
2. Create a project and copy your database **connection URI**:
   `postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres`

### 2. Backend Setup (Render)
1. Deploy a **Web Service** on [Render](https://render.com) linked to this repository.
2. Set **Base Directory** to `backend`.
3. Set **Start Command** to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Add environment variables:
   * `DATABASE_URL` = `[YOUR-SUPABASE-CONNECTION-URI]`
   * `GROQ_API_KEY` = `[YOUR-GROQ-API-KEY]`

### 3. Frontend Setup (Vercel)
1. Import this repository in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   * `NEXT_PUBLIC_API_URL` = `[YOUR-RENDER-BACKEND-URL]`
4. Click Deploy!
