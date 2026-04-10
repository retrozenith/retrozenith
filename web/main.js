import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  // Typing effect
  const words = [
    "Full-Stack Developer", 
    "DevOps Enthusiast", 
    "System Architect", 
    "Tech Autodidact"
  ];
  let i = 0;
  let isDeleting = false;
  let currentWord = "";
  const typingElement = document.getElementById('typing-text');
  
  function typeWriter() {
    if (i < words.length) {
      const fullWord = words[i];

      if (isDeleting) {
        currentWord = fullWord.substring(0, currentWord.length - 1);
      } else {
        currentWord = fullWord.substring(0, currentWord.length + 1);
      }

      typingElement.innerHTML = currentWord;

      let typeSpeed = 100;

      if (isDeleting) {
        typeSpeed = 50;
      }

      if (!isDeleting && currentWord === fullWord) {
        // Pause at the end of the word
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentWord === "") {
        // Word is fully deleted, move to next
        isDeleting = false;
        i = (i + 1) % words.length;
        typeSpeed = 500;
      }

      setTimeout(typeWriter, typeSpeed);
    }
  }

  typeWriter();

  // Scroll animations using Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Optional: only animate once
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
  animatedElements.forEach(el => observer.observe(el));

  // Navbar transparent on top
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(5, 5, 5, 0.85)';
      navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(5, 5, 5, 0.7)';
      navbar.style.boxShadow = 'none';
    }
  });

  // Submarine Tracking Overlay & Interaction
  const submarine = document.getElementById('submarine-wrapper');
  const subSvg = submarine.querySelector('.submarine-svg');
  const subLight = submarine.querySelector('.submarine-light');
  
  // Custom cursor ring
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursorRing);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let subX = mouseX;
  let subY = mouseY;
  let currentAngle = 0;

  let isHoveringButton = false;
  let hoveredRect = null;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  let time = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorRing.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll('.btn, .nav-links a, .contact-btn, .project-card, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      if(isMobile) return;
      isHoveringButton = true;
      hoveredRect = el.getBoundingClientRect();
      submarine.classList.add('hover-mode');
      cursorRing.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      isHoveringButton = false;
      submarine.classList.remove('hover-mode');
      cursorRing.classList.remove('active');
    });
  });

  function animateSubmarine() {
    let targetX = mouseX;
    let targetY = mouseY;
    let interestX = mouseX;
    let interestY = mouseY;

    if (isMobile) {
      time += 0.01;
      // Roam elegantly in a figure-8 independent of cursor
      targetX = window.innerWidth / 2 + Math.cos(time) * (window.innerWidth * 0.35);
      targetY = window.innerHeight / 2 + Math.sin(time * 2) * (window.innerHeight * 0.25);
      cursorRing.style.display = 'none';
      
      let nextTime = time + 0.5;
      interestX = window.innerWidth / 2 + Math.cos(nextTime) * (window.innerWidth * 0.35);
      interestY = window.innerHeight / 2 + Math.sin(nextTime * 2) * (window.innerHeight * 0.25);
      
      subX += (targetX - subX) * 0.02;
      subY += (targetY - subY) * 0.02;
    } else {
      if (isHoveringButton && hoveredRect) {
        // Park submarine near the hovered element
        let spaceLeft = hoveredRect.left;
        if (spaceLeft > 200) {
          targetX = hoveredRect.left - 150;
          targetY = hoveredRect.top + hoveredRect.height / 2;
        } else {
          targetX = hoveredRect.right + 150;
          targetY = hoveredRect.top + hoveredRect.height / 2;
        }
        interestX = hoveredRect.left + hoveredRect.width / 2;
        interestY = hoveredRect.top + hoveredRect.height / 2;
      } else {
        // Limit tracking distance (orbit circle around cursor)
        const dxCursor = mouseX - subX;
        const dyCursor = mouseY - subY;
        const distCursor = Math.sqrt(dxCursor * dxCursor + dyCursor * dyCursor);
        const minDistance = 150;
        let targetAngle = Math.atan2(dyCursor, dxCursor);

        if (distCursor > minDistance) {
          targetX = mouseX - Math.cos(targetAngle) * minDistance;
          targetY = mouseY - Math.sin(targetAngle) * minDistance;
        } else {
          targetX = subX; 
          targetY = subY;
        }
        interestX = mouseX;
        interestY = mouseY;
      }

      subX += (targetX - subX) * 0.04;
      subY += (targetY - subY) * 0.04;
    }

    let dxFinal = interestX - subX;
    let dyFinal = interestY - subY;
    let distFinal = Math.sqrt(dxFinal * dxFinal + dyFinal * dyFinal);

    let targetRotation = Math.atan2(dyFinal, dxFinal) * 180 / Math.PI;
    let diff = targetRotation - currentAngle;
    diff = ((diff + 180) % 360 + 360) % 360 - 180;
    currentAngle += diff * 0.08;

    submarine.style.transform = `translate(${subX}px, ${subY}px) rotate(${currentAngle}deg)`;

    // Tunnel light effect logic
    let isAligned = Math.abs(diff) < 15;
    
    if (isAligned && !isMobile) {
      subLight.style.width = `${distFinal}px`;
      subLight.style.clipPath = 'polygon(0 48%, 100% 35%, 100% 65%, 0 52%)';
      subLight.style.opacity = '0.8';
      if(isHoveringButton) {
        subLight.style.background = 'linear-gradient(90deg, rgba(88, 166, 255, 0.4) 0%, rgba(88, 166, 255, 0) 100%)';
      } else {
        subLight.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)';
      }
    } else {
      subLight.style.width = `150px`;
      subLight.style.clipPath = 'polygon(0 48%, 100% 0%, 100% 100%, 0 52%)';
      subLight.style.opacity = '0.3';
      subLight.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)';
    }

    if (currentAngle > 90 || currentAngle < -90) {
      subSvg.style.transform = `scaleY(-1)`;
    } else {
      subSvg.style.transform = `scaleY(1)`;
    }

    requestAnimationFrame(animateSubmarine);
  }

  animateSubmarine();

});
