import React, { useEffect } from 'react';

const Particles = () => {
  useEffect(() => {
    // Create particles
    const container = document.getElementById('particles');
    if (!container) return;

    // Clear existing particles
    container.innerHTML = '';

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 4 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = 'rgba(16, 185, 129, 0.5)';
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
      particle.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(particle);
    }

    // Cleanup
    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <div className="particles-bg" id="particles"></div>;
};

export default Particles;