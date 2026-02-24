# Navi Mumbai House Price Predictor

A deployment-ready Machine Learning web application predicting residential property prices in Navi Mumbai.

## Technologies Used
- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: FastAPI, Uvicorn, Pydantic
- **Machine Learning**: Scikit-Learn, RandomForestRegressor, joblib

## Project Structure
- `/backend`: The FastAPI application and endpoints.
- `/frontend`: The modern, responsive Next.js web application.
- `/ml`: Model training scripts and raw datasets.
- `render.yaml`: Deployment config for Render.

## Setup Instructions

### Backend (FastAPI)
1. Navigate to the `backend` directory.
2. Install dependencies: `pip install -r requirements.txt`.
3. Train the model: Run `python ../ml/train.py` from the root directory to generate `model.joblib`.
4. Run the server locally: `uvicorn app.main:app --reload`.

### Frontend (Next.js)
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Set the `.env.local` to point to backend (e.g. `NEXT_PUBLIC_API_URL=http://localhost:8000`).
4. Run the application locally: `npm run dev`.

## Production Deployment
- **Backend**: Point to `render.yaml` for Render deployment. 
- **Frontend**: Connect Vercel to deploying the `frontend` folder directly.
