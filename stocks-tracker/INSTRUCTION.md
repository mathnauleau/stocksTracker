# Run a `.tsx` File in VSCode with Live Preview

This guide will help you run a `.tsx` (TypeScript + JSX) file in VSCode using Vite. No coding experience required.

App available at https://claude.ai/public/artifacts/8631d6a8-7921-4134-8970-abfb36222563

> [!IMPORTANT]
> .tsx files are not directly viewable in the browser like .html. You need to compile them using a tool like React + TypeScript + Vite or similar. But I’ll guide you in the simplest possible way using Vite.

---

## 🚀 Requirements

- [VSCode](https://code.visualstudio.com/) installed
- [Node.js (LTS)](https://nodejs.org/) installed (includes `npm`)
- A .tsx file downloaded to your computer

---

## 🛠️ Steps

### 1. Install Node.js
Download and install the **LTS version** from [nodejs.org](https://nodejs.org/).

---

### 2. Open the Terminal in VSCode
- Open VSCode
- Go to `Terminal` → `New Terminal`

---

### 3. Create a New Vite Project

In the terminal, run:

```bash
npm create vite@latest my-project -- --template react-ts
```

### 4. Run the project locally

In the terminal, run:

```bash
npm run dev
```