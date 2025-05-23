# Task Note App

A simple task management and note-taking application built with React that helps you organize tasks and record timestamped events.

## 🚀 Features

- **Task Management**
  - Create, edit, and delete tasks
  - Mark tasks as complete/incomplete
  - Filter tasks by status
  - Drag-and-drop task reordering

- **Timestamp Notes**
  - Add timestamped notes and events
  - Automatic time tracking
  - Search and filter notes
  - Export notes functionality

## 🛠️ Tech Stack

- React.js
- CSS Modules
- Local Storage for data persistence
- React Beautiful DnD for drag-and-drop
- Day.js for time handling

## 📁 Project Structure

```
task-note-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── TaskChecklist/
│   │   │   ├── index.js
│   │   │   └── styles.module.css
│   │   └── TimestampNotes/
│   │       ├── index.js
│   │       └── styles.module.css
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   └── helpers.js
│   ├── styles/
│   │   └── global.css
│   └── App.js
├── package.json
└── README.md
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/task-note-app.git
   ```

2. **Install dependencies**
   ```bash
   cd task-note-app
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Deployment

This app can be deployed to GitHub Pages using the following steps:

1. Install gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add these scripts to package.json:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js documentation
- Create React App
- React Beautiful DnD

---

Made with ❤️ by [CometCafe]