import React, { useState } from 'react';
import Evaluator from './components/Evaluator';
import Shader from './components/Shader';

function App() {
  const [activeTab, setActiveTab] = useState('evaluator');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password) {
      setIsAuthenticated(true);
    } else {
      alert('Please enter a password.');
    }
  };

  const handleAuthFailed = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-cyan-400">Enter Password</h1>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Password"
            />
            <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors duration-300">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

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
          {activeTab === 'shader' && <Shader password={password} onAuthFailed={handleAuthFailed} />}
        </main>
      </div>
    </div>
  );
}

export default App;