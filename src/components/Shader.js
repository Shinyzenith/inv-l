import React, { useState, useEffect, useRef } from 'react';

// Default Shadertoy-like fragment shader
const defaultFragmentShader = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      
      // Create a simple animated pattern
      vec3 color = vec3(0.0);
      color.r = sin(uv.x * 10.0 + u_time) * 0.5 + 0.5;
      color.g = sin(uv.y * 10.0 + u_time * 1.5) * 0.5 + 0.5;
      color.b = sin((uv.x + uv.y) * 5.0 + u_time * 2.0) * 0.5 + 0.5;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

function Shader() {
  const [shaderInput, setShaderInput] = useState('');
  const [currentShaderCode, setCurrentShaderCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const webglContextRef = useRef(null);

  const initWebGL = (fragmentShaderSource) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return null;
    }

    // Vertex shader for full-screen quad
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (vertexShader, fragmentShader) => {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return null;

    const program = createProgram(vertexShader, fragmentShader);
    if (!program) return null;

    // Create full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');

    return {
      gl,
      program,
      positionBuffer,
      positionAttributeLocation,
      resolutionUniformLocation,
      timeUniformLocation
    };
  };

  const render = (webglContext) => {
    const { gl, program, positionBuffer, positionAttributeLocation, resolutionUniformLocation, timeUniformLocation } = webglContext;
    
    // Set viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    // Clear canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Use program
    gl.useProgram(program);
    
    // Set uniforms
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(timeUniformLocation, (Date.now() - startTimeRef.current) / 1000.0);
    
    // Bind position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  useEffect(() => {
    const shaderToUse = currentShaderCode || defaultFragmentShader;
    const webglContext = initWebGL(shaderToUse);

    if (!webglContext) {
      if (currentShaderCode) {
        alert("The generated shader is invalid. Reverting to the default shader.");
      }
      return;
    }
    
    webglContextRef.current = webglContext;

    const animate = () => {
      render(webglContext);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentShaderCode]);

  const handleShaderSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: shaderInput }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      let shaderCode = data.response;
      shaderCode = shaderCode
        .replace(/```glsl\n/g, '')
        .replace(/```/g, '')
        .trim();
      
      console.log('Generated shader:', shaderCode);
      setCurrentShaderCode(shaderCode);
    } catch (error) {
      console.error('Error generating shader:', error);
      alert('Failed to generate shader: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Text-to-Shader Generator</h2>
      <form onSubmit={handleShaderSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={shaderInput}
          onChange={(e) => setShaderInput(e.target.value)}
          placeholder="e.g., swirling colors, plasma effect"
          disabled={isLoading}
          className="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors duration-300 disabled:bg-gray-600">
          {isLoading ? 'Generating...' : 'Generate Shader'}
        </button>
      </form>
      <canvas 
        ref={canvasRef} 
        width="800" 
        height="600"
        className="mt-6 rounded-lg shadow-lg border-2 border-cyan-500/50"
      ></canvas>
      {currentShaderCode && (
        <div className="mt-6 w-full max-w-4xl">
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">Generated Shader Code:</h3>
          <pre className="bg-gray-900 p-4 rounded-lg text-sm text-left text-gray-300 overflow-auto max-h-96 border border-gray-700">
            {currentShaderCode}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Shader;
