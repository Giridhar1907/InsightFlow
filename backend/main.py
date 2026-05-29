from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from database.db_setup import init_db

# Import routes
from api.routes.auth import router as auth_router
from api.routes.billing import router as billing_router
from api.routes.datasets import router as datasets_router
from api.routes.analytics import router as analytics_router
from api.routes.kpi import router as kpi_router
from api.routes.chart import router as chart_router
from api.routes.auto_dashboard import router as auto_dashboard_router
from api.routes.executive_summary import router as executive_summary_router
from api.routes.insights import router as insights_router
from api.routes.questions import router as questions_router
from api.routes.exploration import router as exploration_router

# Initialize Database tables safely
try:
    init_db()
except Exception as e:
    print("=========================================")
    print("STARTUP SCHEMA INITIALIZATION FAILED:")
    print(f"Error detail: {str(e)}")
    print("Proceeding with server startup...")
    print("=========================================")

app = FastAPI(title="InsightFlow API - SaaS Edition")

# In production SaaS, you would restrict allowed origins, but for this setup:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "InsightFlow Backend - SaaS Edition Running"
    }

# Register SaaS modules first
app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    billing_router,
    prefix="/billing",
    tags=["Billing & Quotas"]
)

app.include_router(
    datasets_router,
    prefix="/datasets",
    tags=["Datasets"]
)

# Register analytics and AI routes
app.include_router(
    analytics_router,
    prefix="/analytics",
    tags=["Analytics"]
)

app.include_router(
    kpi_router,
    prefix="/kpi",
    tags=["KPI"]
)

app.include_router(
    chart_router,
    prefix="/chart",
    tags=["Charts"]
)

app.include_router(
    questions_router,
    prefix="/questions",
    tags=["Questions"]
)

app.include_router(
    auto_dashboard_router,
    prefix="/auto-dashboard",
    tags=["Auto Dashboard"]
)

app.include_router(
    executive_summary_router,
    prefix="/executive-summary",
    tags=["Executive Summary"]
)

app.include_router(
    insights_router,
    prefix="/insights",
    tags=["Insights"]
)

app.include_router(
    exploration_router,
    prefix="/exploration",
    tags=["Exploration"]
)
