import React, { useState } from 'react';
import Evaluator from './components/Evaluator';
import Shader from './components/Shader';

function App() {
  const [activeTab, setActiveTab] = useState('evaluator');

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto p-4">
        <div className="flex justify-center mb-6 bg-gray-800 rounded-lg p-2">
          <button 
            onClick={() => setActiveTab('evaluator')} 
            className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ${activeTab === 'evaluator' ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            Natural Expression Evaluator
          </button>
          <button 
            onClick={() => setActiveTab('shader')} 
            className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ml-4 ${activeTab === 'shader' ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            Text-to-Shader
          </button>
        </div>
        <main className="p-6 bg-gray-800 rounded-xl shadow-2xl">
          {activeTab === 'evaluator' && <Evaluator />}
          {activeTab === 'shader' && <Shader />}
        </main>
      </div>
    </div>
  );
}

export default App;
