# AidWell - Intelligent Health Assistant

*A Smart Healthcare Companion for All*

---

## 🎥 Application Preview

![Image](https://github.com/user-attachments/assets/d24ca92e-fe52-47ce-b270-e8d3b5a6c041)

---

## 🚀 Project Overview

AidWell is an intelligent healthcare application built with **React Native & Expo**. It provides users with an interactive and user-friendly platform to track symptoms, manage medications, and chat with an AI-powered nurse for basic medical inquiries.

### Core Features:
✅ Symptom Checker  
✅ Medication Management  
✅ AI-powered Nurse Chat (using **Gemini AI API**)  
✅ Cross-platform Compatibility (iOS & Android)

AidWell is designed with modular architecture, making it scalable and easy to maintain. The **AI-powered Nurse Chat** tab leverages the **Gemini API** to provide intelligent, real-time responses to user health-related questions. Additionally, **React’s context and hooks** are used for efficient state management.

---

## 📂 Project Structure

```
project/
│-- .expo/                 # Expo project metadata
│-- assets/                # Images, icons, and assets
│-- app/                   # Main application components
│   ├── chat.tsx           # AI chat interface (Uses Gemini API for AI Nurse)
│   ├── index.tsx          # Main entry point
│   ├── medications.tsx    # Medication tracking
│   ├── symptoms.tsx       # Symptom checker
│   ├── _layout.tsx        # Main layout file
│-- hooks/                 # Custom React hooks
│-- store/                 # Application state management
│-- utils/                 # Utility functions
│   ├── gemini.ts          # Handles API calls to Gemini AI
│-- package.json           # Dependencies and scripts
│-- eas.json               # EAS build configuration
│-- metro.config.js        # Metro bundler configuration
│-- tsconfig.json          # TypeScript configuration
│-- .gitignore             # Ignored files for Git
```

### How the Application Works

1️⃣ **Symptom Checker**  
- Users enter their symptoms, and the app suggests possible conditions.
- The logic is handled in `symptoms.tsx`, which interacts with an internal dataset or API.

2️⃣ **Medication Management**  
- Users can add medications, set reminders, and track dosage.
- Implemented in `medications.tsx`, with state management for tracking user inputs.

3️⃣ **AI-Powered Nurse Chat**  
- Users can interact with an AI-powered chatbot for health inquiries.
- The chatbot is powered by the **Gemini AI API**, configured in `gemini.ts`.
- The `chat.tsx` component handles user input, API calls, and response rendering.

4️⃣ **Navigation & UI**  
- The app follows a structured layout using `index.tsx` and `_layout.tsx`.
- Components are dynamically loaded, ensuring smooth transitions between pages.

---

## 🛠️ Installation & Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/StalinAbraham/aidwell.git
cd aidwell
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Run the Project

```sh
npx expo start
```

- Scan the QR code with Expo Go (Android) or use an emulator.

---

## 📦 Building the App

### Android Build

```sh
eas build -p android --profile preview
```

### iOS Build

```sh
eas build -p ios --profile preview
```

---

## ❓ Troubleshooting

### Common Issues & Fixes

1️⃣ **Expo not recognized?**

```sh
npm install -g expo-cli
```

2️⃣ **Metro Bundler crashes?**

```sh
npx expo start --clear
```

3️⃣ **Dependencies mismatch?**

```sh
npx expo install --check
```

4️⃣ **App not running properly?** Ensure all required dependencies are installed correctly:

```sh
npx expo install
```

If you encounter any issues, consider removing `node_modules` and `package-lock.json`, then reinstalling dependencies:

```sh
rm -rf node_modules package-lock.json
npm install
```

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

### 🎉 Happy Coding! 🚀

