
# Deployment Guide: Distillery Checklists

## 1. Database Setup (Supabase)
- Create a project at https://supabase.com
- Open the **SQL Editor**.
- Run the code in `schema.sql`.

## 2. Infrastructure Setup (Vercel)
- Create a new project on Vercel.
- Connect your repository.
- Add these **Environment Variables**:
  - `SUPABASE_URL`: Found in Project Settings > API.
  - `SUPABASE_SERVICE_ROLE_KEY`: Found in Project Settings > API. **Keep this secret.**

## 3. Launch
- Deploy the project.
- Access the app via your Vercel URL.
- The templates are pre-populated with your distillery's opening/closing steps.

## Security Overview
- **No Login Required**: Access is open as requested.
- **Server-Side Security**: Database keys are stored on the server and never sent to the browser.
- **Data Integrity**: Checklist items are snapshotted at creation time, preserving historical accuracy.
