# Admin Panel Frontend

This project is an online scheduling plataform where any user can book appointments, and an administrator can manage all services and availability blocks through a protected admin panel. Built with React, Vite, TypeScript, and TailwindCSS.

![React](https://img.shields.io/badge/React-white?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-white?style=for-the-badge&logo=vite&logoColor=black)
![Typescript](https://img.shields.io/badge/Typescript-white?style=for-the-badge&logo=typescript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-white?style=for-the-badge&logo=tailwindcss&logoColor=black)


---

## Table of Contents

- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Running the Application](#running-the-application)  
- [Environment Variables](#environment-variables)  
- [Technologies Used](#technologies-used)  
- [Features](#features) 
- [Backend](#backend)  
  
---

## Prerequisites

Before you begin, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)  
- [npm](https://www.npmjs.com/get-npm) (Node package manager)  
- The <a href="https://github.com/malu-monteiro/admin-panel-backend">Admin Panel</a> Backend running and accessible

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/malu-monteiro/admin-panel-frontend.git
cd admin-panel-frontend
```

2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the project root by copying the example file:
```bash
cp .env.example .env
```
---

## Running the Application

Start the development server:
```bash
npm run dev
```
The app will be available at http://localhost:5173.

---

## Environment Variables

Create a `.env` file based on `.env.example` with the following variables:

```bash
# API backend URL (default for local development)
VITE_API_URL=http://localhost:3000

# Frontend URL (default for local development)
FRONTEND_URL=http://localhost:5173
```

---

## Technologies Used

- [React](https://react.dev/)  
- [Vite](https://vite.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [TailwindCSS](https://tailwindcss.com/)  
- [React Query](https://tanstack.com/query/latest)  
- [React Hook Form](https://react-hook-form.com/)  
- [Zod](https://zod.dev/)  
- [Radix UI](https://www.radix-ui.com/)  
- [Framer Motion](https://motion.dev/) 
- [Lucide React](https://lucide.dev/)  
- [React Icons](https://react-icons.github.io/react-icons/) 
- [Sonner](https://sonner.emilkowal.ski/) 

---

## Features

Public Side

- Users can view available time slots and book appointments online

Admin Panel

- Admin login (the initial admin account is created via backend seed)
- Define business hours (opening times)
- Manage dates and available time slots (availability/calendar)
- Manage services 
- Manage blocked periods (e.g., holidays, maintenance)
- Change admin name, email and password

General

- Responsive, modern UI

---

## Backend

This frontend requires the Admin Panel Backend to be running.

- The backend handles all scheduling, authentication, and admin operations.
- Make sure the `VITE_API_URL` in your `.env` points to the correct backend address.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. 😊

---

Made with 💜 by [malu-monteiro](https://github.com/malu-monteiro) | [Linkedin](https://www.linkedin.com/in/m-monteiro/)
