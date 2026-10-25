Chitkara Connect 🎓

Chitkara Connect is a React-based campus companion designed to help
Chitkara University students find campus facilities, manage their class
timetable, report lost and found items, and stay updated with campus
notices.

✨ Features

Campus Block Finder --- Explore campus locations and find
academic blocks, food courts, and other facilities on an interactive
map.

Class Planner --- Add and manage classes, view your next class,
and identify timetable clashes.

Lost & Found Portal --- Post, search, edit, and resolve lost or
found item listings.

Campus Notices --- Browse notices with search, category filters,
sorting, saved notices, and infinite scrolling.

Login and Signup --- Create an account and access protected
pages.

Weather Card --- View current weather information for the campus
area.

Responsive UI --- Reusable components and page layouts for a
smoother experience.

🧰 Tech Stack

Frontend: React 18

Build Tool: Vite

Routing: React Router

State Management: Zustand and React Context API

HTTP Requests: Axios

Map: Leaflet

APIs: JSONPlaceholder (demo notice data) and Open-Meteo (weather
data)

Styling: CSS

📁 Project Structure

chitkara-connect-react/
├── public/
│   ├── images/
│   └── _redirects
├── src/
│   ├── components/    # Reusable UI components
│   ├── context/       # Authentication, theme, and toast contexts
│   ├── data/          # Static campus data
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Home, Login, Signup, Map, Planner, Lost & Found, Notices
│   ├── services/      # API requests
│   ├── store/         # Zustand stores
│   ├── utils/         # Validation helpers
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── README.md

🚀 Getting Started

Prerequisites

Install Node.js (LTS), which includes npm.
Download it from the official Node.js
website.

1. Clone the repository

Replace <your-username> with your GitHub username:

git clone https://github.com/<your-username>/chitkara-connect-react.git
cd chitkara-connect-react

Alternatively, download the repository as a ZIP file and extract it.

2. Install dependencies

npm install

3. Start the development server

npm run dev

Open the local URL shown in your terminal, usually:

http://localhost:5173/

4. Create a production build

npm run build

Vite creates the production-ready files in the dist/ directory.

5. Preview the production build (optional)

npm run preview

🔌 API Information

Campus notices: The app uses
JSONPlaceholder as a demo
REST API. The returned posts are adapted into sample campus notices;
they are not official university announcements.

Weather: Current weather data is retrieved from
Open-Meteo.

An internet connection is required for these API-powered features.

💾 Data and Authentication Notes

This project is a frontend demonstration. Account details, the current
login session, timetable entries, and some saved data are stored in the
browser using localStorage.

Data is specific to the browser and device where it was created.

Clearing browser storage can remove locally saved data.

This demo does not provide production-grade authentication or
server-side data storage. Do not use real or sensitive passwords.

For a production deployment, connect a secure backend and implement
proper authentication and authorization.

☁️ Deployment

This project can be deployed to a static hosting platform such as
Vercel or Netlify.

Push the project to a GitHub repository.

Import the repository into your hosting provider.

Use the following build settings:

Build command: npm run build

Output directory: dist

Ensure the host is configured to serve the React single-page
application correctly on direct route visits. This repository
includes vercel.json and public/_redirects for SPA routing
support.

After deployment, test the home page, sign-up/login flow, and each
protected route.

🧑‍💻 Useful Scripts

Command             Description

npm install       Install project dependencies
npm run dev       Start the local development server
npm run build     Build the app for production
npm run preview   Preview the production build locally

🎯 Project Purpose

Chitkara Connect brings common student needs into one place: campus
navigation, timetable planning, lost-and-found listings, and campus
updates.

🤝 Contributing

Suggestions and improvements are welcome:

Fork the repository.

Create a branch for your change.

Make and test your changes.

Open a pull request describing your update.

📄 License

No license has been specified yet. If you want others to reuse or modify
this project, add a suitable open-source license file to the repository.
