# 📝 Full-Stack Todo Application

A modern, production-ready todo application built with React, TypeScript, Node.js, and SQLite. Features user authentication, real-time CRUD operations, and beautiful responsive design.

<image src="public/app_screenshot.png" width="60%" height="60%">

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based login/register system
- 📝 **CRUD Operations** - Create, read, update, and delete todos
- ✏️ **Inline Editing** - Edit todos directly with save/cancel options
- 🎨 **Beautiful UI** - Gradient backgrounds with Space Mono typography
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🔄 **Real-time Updates** - Changes persist instantly to the database
- 🛡️ **Secure** - Password hashing, token expiration, CORS protection
- 🚀 **Production Ready** - Environment variables, error handling, deployment configs

## 🏗️ Tech Stack

### **Frontend**
- **React 19.1.1** with TypeScript
- **Vite 7.1.0** for fast development and building
- **styled-components 6.1.19** for CSS-in-JS styling
- **Axios** for API communication
- **React Icons** for beautiful icons

### **Backend**
- **Node.js** with **Express.js** framework
- **TypeScript** for type safety
- **Prisma ORM** with SQLite database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager

### **1. Clone & Install**
```bash
git clone https://github.com/yourusername/todo-vite-fs.git
cd todo-vite-fs

# Install frontend dependencies
npm install

# Install backend dependencies
cd todo-backend
npm install
```

### **2. Setup Environment Variables**
```bash
# Root directory - create .env
echo "VITE_API_URL=http://localhost:3001" > .env

# Backend directory - create .env
cd todo-backend
echo "DATABASE_URL=\"file:./prisma/dev.db\"
JWT_SECRET=\"your-super-secure-jwt-secret-change-this\"
NODE_ENV=\"development\"
PORT=3001
FRONTEND_URL=\"http://localhost:5173\"" > .env
```

### **3. Setup Database**
```bash
# In todo-backend directory
npx prisma generate
npx prisma db push
```

### **4. Run the Application**

**Terminal 1 - Backend:**
```bash
cd todo-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Visit `http://localhost:5173` and start creating todos! 🎉

## 📁 Project Structure

```
todo-vite-fs/
├── src/                          # Frontend source code
│   ├── components/
│   │   └── Auth.tsx             # Authentication component
│   ├── services/
│   │   └── api.ts               # API service layer
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── App.tsx                  # Main application component
├── todo-backend/                # Backend source code
│   ├── src/
│   │   ├── controllers/         # Business logic
│   │   ├── middleware/          # Authentication middleware
│   │   ├── routes/              # API routes
│   │   └── server.ts            # Express server
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── dev.db              # SQLite database
│   └── package.json
├── DEPLOYMENT.md               # Production deployment guide
└── README.md
```

## 🎯 API Endpoints

### **Authentication**
- `POST /auth/register` - Create new user account
- `POST /auth/login` - User login

### **Todos** (Protected Routes)
- `GET /notes` - Get all user's todos
- `POST /notes` - Create new todo
- `PUT /notes/:id` - Update specific todo
- `DELETE /notes/:id` - Delete specific todo

### **Health Check**
- `GET /health` - Server health status

## 🛠️ Available Scripts

### **Frontend Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### **Backend Scripts**
```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript and generate Prisma client
npm start            # Start production server
npm run deploy       # Full deployment script
```

## 🚀 Production Deployment

This application is ready for deployment on platforms like Vercel, Railway, or Heroku.

**Quick Vercel Deployment:**
1. Push to GitHub
2. Import repository to Vercel (twice - once for frontend, once for backend)
3. Set environment variables
4. Deploy!

## 🔐 Security Features

- ✅ **JWT tokens** with 24-hour expiration
- ✅ **Password hashing** with bcrypt (salt rounds: 10)
- ✅ **CORS protection** configured for specific origins
- ✅ **Request validation** and error handling
- ✅ **Environment variables** for sensitive data
- ✅ **No sensitive data** exposed to frontend

## 🎨 Design System

- **Color Palette**: Pink/purple gradient background (#f79177 → #b92a59)
- **Typography**: Space Mono font family (monospace)
- **Components**: Consistent border radius (3px inputs, 7px containers)
- **Interactions**: Smooth hover effects and transitions
- **Responsive**: Mobile-first design with clamp() functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React and Node.js best practices
- Inspired by clean, minimalist design principles
- Uses industry-standard authentication and security patterns

---

**Made with 💖 by [Adelicia Sequeira](https://github.com/adelicia-js)**

