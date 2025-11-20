## 🚀 JobWallah – MERN Job Portal

JobWallah is a full-stack MERN job portal where recruiters can create job openings, manage applicants, filter resumes using ATS-based scoring, and send feedback — while candidates can browse jobs, upload resumes, apply, and get keyword-based resume improvement suggestions.
A modern gradient UI powered by Tailwind CSS, with responsive design and a clean UX.

🔗 Live: https://jobwallah.vercel.app

🔗 GitHub: https://github.com/Ayushpandey2026/Job_Portal


📌 Features
| Feature               | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| Job Creation          | Add job title, JD, openings, salary, constraints, deadline   |
| Auto Seat Reduction   | Selecting a candidate reduces the openings count dynamically |
| Application Filtering | Filter applicants by ATS score, keyword match, and ranking   |
| Feedback System       | Provide personalized rejection reasons to candidates         |
| Dashboard             | JWT-protected recruiter control panel                        |


🧑‍🎓 Candidate Features
| Feature              | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| User Authentication  | Register/Login using secure JWT auth                              |
| Job Search           | Filters similar to Internshala (role, salary, job type, category) |
| Resume Upload        | Upload PDFs for job applications                                  |
| ATS Resume Score     | Keyword analysis, match %, missing keywords, strengths            |
| Application Tracking | View real-time application status                                 |


🧠 ATS Resume Engine Capabilities
| Component          | Function                                    |
| ------------------ | ------------------------------------------- |
| Keyword Extraction | Extracts relevant keywords from JD & resume |
| Resume Matching    | Calculates ATS score (0–100)                |
| Missing Keywords   | Highlights missing required skills          |
| Strong Keywords    | Highlights existing strong skills           |
| Ranking            | Sorts applicants based on score             |



🛠 Tech Stack
| Technology    | Purpose                 |
| ------------- | ----------------------- |
| React.js      | UI Renderer             |
| Redux Toolkit | Global State Management |
| Tailwind CSS  | Styling & Theme         |
| Axios         | API Calls               |
| React Router  | Navigation              |

🖥 Backend
| Technology         | Purpose             |
| ------------------ | ------------------- |
| Node.js            | Server-side runtime |
| Express.js         | REST API framework  |
| MongoDB (Mongoose) | Database & ORM      |
| JWT                | Authentication      |


☁️ Deployment
| Platform         | Purpose             |
| ---------------- | ------------------- |
| Vercel           | Frontend Deployment |
| Render / Railway | Backend Hosting     |
| MongoDB Atlas    | Cloud Database      |


## 📦 Installation Instructions

Clone the Repository

git clone https://github.com/Ayushpandey2026/Job_Portal

cd Job_Portal



## Install Frontend Dependencies


cd client

npm install

npm start


## Install Backend Dependencies


cd server

npm install

npm start


## Required Environment Variables

Create a .env file in server:

MONGO_URI=

JWT_SECRET=

GEMINI_API_KEY=


## ▶️ Usage

Start the backend server

Start the React frontend

Register as:

Recruiter → Create & manage jobs

Candidate → Apply for jobs

Upload your resume to get:

ATS Score

Missing Keywords

Strength Keywords


## Project Folder Structure



<pre>
Job_Portal/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── redux/
│       ├── utils/
│       ├── App.js
│       ├── index.js
│       └── tailwind.css
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/
│   └── server.js
│
└── README.md
</pre>




## 🤝 Contributing Guidelines

Contributions are welcome!

Fork the repository

Create your feature branch

Commit and push

Open a pull request

Follow existing code style and maintain clean commit messages.
