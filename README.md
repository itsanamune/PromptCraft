# PromptCraft

PromptCraft is a user-friendly tool for creating and managing prompts for Large Language Models (LLMs). It offers an intuitive interface to design, organize, and optimize prompts, enhancing AI interactions across various applications. PromptCraft simplifies prompt engineering, making it accessible for both beginners and experts.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

To run PromptCraft on your local machine, follow these steps:

1. Ensure you have [Node.js](https://nodejs.org/) (version 14 or higher) and npm installed.

2. Clone the repository:
   ```
   git clone https://github.com/yourusername/promptcraft.git
   cd promptcraft
   ```

3. Install the required dependencies:
   ```
   npm install react react-dom
   npm install @radix-ui/react-tabs @radix-ui/react-label @radix-ui/react-select
   npm install lucide-react
   npm install tailwindcss@latest postcss@latest autoprefixer@latest
   ```

4. Set up Tailwind CSS:
   ```
   npx tailwindcss init -p
   ```

5. Create a `src/index.css` file and add the following content:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

6. Update your `tailwind.config.js` file:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: ["./src/**/*.{js,jsx,ts,tsx}"],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

7. Start the development server:
   ```
   npm start
   ```

8. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

After starting the application, you can:

1. Create new prompts by filling out the form in the "Create Prompt" tab.
2. View and manage existing prompts in the "View Prompts" tab.
3. Filter prompts by category using the dropdown menu.
4. Edit or delete existing prompts as needed.

## Data Storage and Persistence

PromptCraft currently uses the File System Access API as well as browser memory for data storage, providing a desktop-like experience for managing your prompts.
* <span style="color: red; font-weight: bold;">Very Important Note About Data Storage and Persistence: Currently PromptCraft uses browser memory to store your prompts which means:</span>
- If you use a different browser your prompts wont be saved on the new browser 
- If you clear your browsers cache you may delete your prompts
- If you use an incognito tab you may not see your prompts
- Until we update PromptCraft to a better data storage solution the best practice for ensuring you never lose your prompts is to save them to a file often so you always have a backup

Key features:
1. Direct File Access: Save and load your prompts directly to/from files on your computer.
2. Unlimited Storage: Only limited by your available disk space.
3. Full Control: You decide where to save your data and can easily backup or transfer files.

Important notes:
- Supported in modern browsers (Chrome 86+, Edge 86+, Opera 73+)
- Requires user permission to access files (you'll be prompted to choose a save location)
- Using a incognito tab, using a different browser, or clearing your browser cache will erase your prompts 
- Data is stored entirely on your local device

To use:
1. Click the "Save Data" button to save your prompts. You'll be prompted to choose a save location and filename on first use.
2. Click the "Load Data" button to load previously saved prompts. You'll be prompted to select the file to load.

## Features

- Create and store custom prompts
- Create and store prompt modules (sections of prompts you want to reuse in other prompts)
- Categorize prompts and modules for easy organization
- Filter and search functionality
- User-friendly interface for prompt management
- Local storage for persisting data between sessions

## Contributing

We welcome contributions to PromptCraft! If you have suggestions for improvements or bug fixes, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

For any questions or support, please open an issue in the GitHub repository.