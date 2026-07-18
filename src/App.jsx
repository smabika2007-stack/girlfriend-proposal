import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

import './App.css';

function App() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [noClicks, setNoClicks] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const noButtonRef = useRef(null);
  const yesButtonRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [isPlaying]);
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(1);
      setIsPlaying(true);
    }
  };

  const handleNoHover = (e) => {
    if (e?.type === 'touchstart') {
      e.preventDefault();
    }
    if (noClicks < 5) {
      const maxX = window.innerWidth * 0.4;
      const maxY = window.innerHeight * 0.4;
      const randomX = (Math.random() - 0.5) * maxX;
      const randomY = (Math.random() - 0.5) * maxY;
      setNoPosition({ x: randomX, y: randomY });
      setNoClicks((prev) => prev + 1);
      
      if (noClicks === 4) {
        // Collide into Yes button on the 5th hover
        setTimeout(() => {
          if (yesButtonRef.current && noButtonRef.current) {
            const yesRect = yesButtonRef.current.getBoundingClientRect();
            const noRect = noButtonRef.current.getBoundingClientRect();
            
            // Calculate distance to center of Yes button relative to initial state 0,0
            // Because noPosition is relative to its original position
            // But actually we can just find its original offset and add difference
            // A simpler way: we just set it to the distance between their centers when they were at 0,0
            // Since they are flex items, we can calculate the distance between them easily.
            // Let's approximate: the Yes button is to the left of the No button
            const btnDistance = yesRect.left - noRect.left;
            
            setNoPosition({ x: btnDistance, y: 0 });
            
            setTimeout(() => {
              handleYes();
            }, 600);
          }
        }, 300);
      }
    }
  };

  const handleYes = () => {
    setStep(2);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffb6c1', '#ff69b4', '#ff1493', '#c71585']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffb6c1', '#ff69b4', '#ff1493', '#c71585']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="app-container">
      <audio ref={audioRef} src="/Jovan Perez - Feel Again (Lyrics).mp3" loop />
      <div className="hearts-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`heart-bg-item heart-${i}`}></div>
        ))}
      </div>
      
      <motion.div 
        className="card-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="card-content">
          <p className="sender">From: Junior</p>

          {step === 0 && (
            <motion.div 
              className="step-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="greeting">A Special Message</h1>
              <p className="instruction">Who is this lovely card for?</p>
              <form onSubmit={handleNameSubmit} className="name-form">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="name-input cursive"
                  autoFocus
                />
                <button type="submit" className="continue-btn">Open Card</button>
              </form>
              <p className="volume-hint" style={{ marginTop: '15px', color: '#ff1493', fontStyle: 'italic' }}>
                (P.S. Babe, raise your volume! 🎵)
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              className="step-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1 className="the-question" style={{ marginBottom: '40px', lineHeight: '1.4' }}>
                <span className="cursive highlight">{name}</span>,<br/>will you be my girlfriend?
              </h1>
              
              <div className="buttons-container">
                <button ref={yesButtonRef} className="yes-btn heart-shape-btn" onClick={handleYes}>
                  <span className="yes-text">Yes</span>
                </button>
                <motion.button
                  ref={noButtonRef}
                  className={`no-btn ${noClicks >= 5 ? 'no-btn-heart' : ''}`}
                  onMouseEnter={noClicks >= 5 ? null : handleNoHover}
                  onClick={noClicks >= 5 ? handleYes : handleNoHover}
                  onTouchStart={noClicks >= 5 ? handleYes : handleNoHover}
                  animate={{ x: noPosition.x, y: noPosition.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span className="no-text">{noClicks >= 5 ? '❤️' : 'No'}</span>
                  {noClicks > 0 && noClicks < 5 && (
                    <div className="legs-container">
                      <div className="leg leg-left"></div>
                      <div className="leg leg-right"></div>
                    </div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              className="step-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h1 className="celebration-title cursive">Yay! ❤️</h1>
              <p className="celebration-text">You just made me the happiest person!</p>
              <Heart size={64} color="#ff1493" fill="#ff1493" className="big-heart" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default App;
