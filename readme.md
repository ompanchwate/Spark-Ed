# Spark-Ed

## 🚀 Overview

Spark-Ed is a CSR-driven educational funding platform designed to bridge the gap between students and companies. The platform enables companies to support students through scholarships, project funding, and educational initiatives using Corporate Social Responsibility (CSR) funds.

The system provides separate dashboards for students and companies, enabling smooth collaboration, project management, scholarship handling, and funding workflows.

---

# ✨ Features

## 👨‍🎓 Student Features
- Student authentication and profile management
- Add and manage academic projects
- Apply for scholarships
- View available funding opportunities
- Track project funding status
- Manage pending project approvals
- Edit and update project details

## 🏢 Company Features
- Company authentication and profile management
- View student projects
- Fund student projects
- Create and manage scholarships
- Track funding requests and approvals
- Project statistics dashboard
- Negotiate project funding workflows

## 🔐 Authentication
- Secure login and signup system
- JWT-based authentication
- Google Authentication integration
- Protected routes for role-based access

---

# 🛠️ Tech Stack

## Frontend
- React.js
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Router DOM
- React Query
- Axios

## Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Google OAuth

---

# 📁 Project Structure

```bash
Spark-Ed/
│
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Company/
│   │   │   └── Student/
│   │   └── hooks/
│
├── server/                 # Backend Application
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── db.js
│   └── index.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/ompanchwate/Spark-Ed.git
cd Spark-Ed
```

---

# 🖥️ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 🔧 Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend will run on:

```bash
http://localhost:3001
```

---

# 🗄️ Environment Variables

Create a `.env` file inside the `server` folder and add the following:

```env
DB_USER=your_database_user    
DB_PASS=your_database_password
DB_HOST=localhost
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret

```

---

# 📡 API Routes

## Authentication Routes

```bash
/api
```

## Student Routes

```bash
/api/student
```

## Company Routes

```bash
/api/company
```

---

# 🎯 Core Modules

## 📚 Scholarship Management
Companies can create scholarships and students can apply through the platform.

## 💡 Project Funding
Students can upload innovative projects and companies can fund them using CSR initiatives.

## 🔔 Notification & Engagement
The platform is designed to support personalized notifications and student-company interaction workflows.

## 🤝 Negotiation Workflow
Supports project funding approval and negotiation flow between companies and students.

---

# 🔒 Security Features

- JWT Authentication
- Protected Routes
- Secure Password Handling
- Role-Based Access Control
- Google OAuth Login

---

# 📸 Screenshots


```md
##Login Page
<img width="2549" height="1273" alt="image" src="https://github.com/user-attachments/assets/b7e1f9f4-295b-4f4b-ac65-4cfa7701c7f2" />


```

---

# 🚀 Future Enhancements

- Real-time notifications
- AI-based scholarship recommendations
- Chat system between students and companies
- Payment gateway integration
- Analytics dashboard
- Mobile application support

---

# 👨‍💻 Author

## Om Panchwate

- LinkedIn: https://www.linkedin.com/in/ompanchwate
- GitHub: https://github.com/ompanchwate

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
