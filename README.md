# Django & React Project

## Project Setup Guide

1. Backend Setup (Django)
Install Dependencies
Make sure you have Python and virtualenv installed. Then run:


  python -m venv venv  # Create virtual environment
  source venv/bin/activate  # Activate it (use venv\Scripts\activate on Windows)
  pip install -r requirements.txt  # Install dependencies
  Apply Migrations & Start Server



  python manage.py migrate
  python manage.py runserver


2. Frontend Setup (React)
Go to the frontend directory and install dependencies:


  cd frontend
  npm install  # Install React dependencies
  npm start  # Start React development server
3. Git Workflow
Create a new branch for each feature:

  git checkout -b feature-branch
After making changes, commit and push:

  git add .
  git commit -m "Your message"
  git push origin feature-branch
Open a Pull Request on GitHub to merge changes.
