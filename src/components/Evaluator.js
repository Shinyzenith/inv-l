import React, { useState } from 'react';

function Evaluator() {
  const [evaluatorInput, setEvaluatorInput] = useState('');
  const [evaluatorResult, setEvaluatorResult] = useState('');

  const handleEvaluatorSubmit = async (e) => {
    e.preventDefault();
      const wasm = await import('./pkg/rs_eval.js');
	  await wasm.default();
      const result = wasm.calculate(evaluatorInput);
      setEvaluatorResult(result);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Expression Evaluator</h2>
      <form onSubmit={handleEvaluatorSubmit} className="w-full max-w-sm">
        <input
          type="text"
          value={evaluatorInput}
          onChange={(e) => setEvaluatorInput(e.target.value)}
          placeholder="Enter expression (e.g., 2+2)"
          className="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors duration-300">
          Calculate
        </button>
      </form>
      {evaluatorResult && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg w-full max-w-sm">
          <p className="text-lg font-semibold text-white">Result:</p>
          <p className="text-xl text-cyan-400 mt-2">{evaluatorResult}</p>
        </div>
      )}
    </div>
  );
}

export default Evaluator;
