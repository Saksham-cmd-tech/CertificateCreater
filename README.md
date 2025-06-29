# 🎓 Certificate Generator App

A dynamic and responsive **certificate generator** built with **React** and **Vite**, allowing users to upload certificate templates, customize text elements like name, URN, and position, and export personalized certificates as a `.zip` file.

---

## 📁 Folder Structure

```
certificate-app/
├── node_modules/           # Dependencies
├── public/
│   └── favicon.ico         # Favicon
├── src/
│   ├── assets/             # CSS files
│   │   ├── App.css
│   │   └── index.css
│   ├── App.jsx             # Main App component
│   ├── index.css           # Global styles
│   ├── main.jsx            # Entry point for Vite
├── webicons/               # Web icons
├── .gitignore              # Git ignore rules
├── eslint.config.js        # ESLint config
├── index.html              # HTML template
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Lock file for npm
├── vite.config.js          # Vite configuration
└── README.md               # Project info (this file)
```

---

## 🚀 Features

- 🖼️ Upload your own background image.
- 📄 Import participants via JSON.
- 🔠 Dynamically place and resize name, URN, and position fields.
- 🎯 Search functionality to preview a specific participant's certificate.
- 📦 Export all generated certificates as a ZIP file.
- 🌒 Dark mode design with a modern UI.

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Saksham-cmd-tech/CertificateCreater.git
cd certificate-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app in dev mode

```bash
npm run dev
```

Visit `http://localhost:5173` to view it in your browser.

---

## 📄 JSON Format

Make sure your participant data looks like this:

```json
[
  {
    "name": "John Doe",
    "urn": "ABC123",
    "team": "1st"
  },
  {
    "name": "Jane Smith",
    "urn": "XYZ789",
    "team": "2nd"
  }
]
```

---

## 🛠 Styling

Main CSS is located in:

- `src/assets/App.css`
- `src/index.css`

You can update colors, fonts, positioning, and other UI elements easily.

---

## 🏗 Built With

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [JSZip](https://stuk.github.io/jszip/) – for creating ZIP downloads

---

## 📄 License

MIT License
