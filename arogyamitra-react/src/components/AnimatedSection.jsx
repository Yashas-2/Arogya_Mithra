import React, { useEffect, useRef } from 'react';

const AnimatedSection = ({ children, className = '', animation = 'fade-in-up' }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const animationStyles = {
    'fade-in-up': {
      opacity: 0,
      transform: 'translateY(30px)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
    },
    'fade-in': {
      opacity: 0,
      transition: 'opacity 0.6s ease-out'
    },
    'slide-in-left': {
      opacity: 0,
      transform: 'translateX(-30px)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
    },
    'slide-in-right': {
      opacity: 0,
      transform: 'translateX(30px)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
    }
  };

  const style = animationStyles[animation] || animationStyles['fade-in-up'];

  return (
    <div 
      ref={sectionRef} 
      className={className}
      style={style}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;