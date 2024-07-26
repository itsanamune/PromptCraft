import React from 'react';
import PromptManager from './components/PromptManager';

function App() {
  return (
    <div className="App bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">PromptCraft</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <PromptManager />
        </div>
      </main>
    </div>
  );
}

export default App;