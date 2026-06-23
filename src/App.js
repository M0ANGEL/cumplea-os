import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2007);
  const [boxClicks, setBoxClicks] = useState(0);
  const [modalData, setModalData] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [showBubble, setShowBubble] = useState(false);
  const [ageInput, setAgeInput] = useState('');
  const [ageError, setAgeError] = useState('');
  const [yearError, setYearError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [sunRisen, setSunRisen] = useState(false);
  const [sunriseVisible, setSunriseVisible] = useState(false);
  const [giftChoice, setGiftChoice] = useState(null);

  const mouseTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const confettiContainerRef = useRef(null);

  // Navegación
  const goToScreen = useCallback((n) => {
    setCurrentScreen(n);
    if (n === 3) {
      setTimeout(() => triggerSunrise(), 300);
    }
  }, []);

  // Modal
  const showModal = useCallback((title, text, cb, yesText) => {
    setModalData({ title, text, cb, yesText });
  }, []);

  const closeModal = useCallback(() => {
    setModalData(null);
  }, []);

  const modalYes = useCallback(() => {
    setModalData(null);
    if (modalData?.cb) modalData.cb();
  }, [modalData]);

  const modalNo = useCallback(() => {
    setModalData(null);
  }, []);

  // Reset
  const resetGame = useCallback(() => {
    setBoxClicks(0);
    setSelectedYear(1997);
    setCurrentScreen(0);
    setSunRisen(false);
    setSunriseVisible(false);
    setCountdown(10);
    setIsCounting(false);
    setGiftChoice(null);
    setAgeInput('');
    setAgeError('');
    setYearError('');
    document.getElementById('s3')?.style?.setProperty('background', '#000');
    const sunContainer = document.getElementById('sun-container');
    if (sunContainer) sunContainer.classList.remove('risen');
    const sunriseMsg = document.getElementById('sunrise-msg');
    if (sunriseMsg) sunriseMsg.classList.remove('visible');
  }, []);

  // Estrellas
  const buildStars = useCallback((containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div');
      star.className = 'star-dot';
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 3}s;
        animation-duration: ${1 + Math.random() * 2}s;
      `;
      container.appendChild(star);
    }
  }, []);

  // Mouse follow
  useEffect(() => {
    const handleMouseMove = (e) => {
      const app = document.getElementById('app');
      const rect = app?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      if (!showBubble) {
        setTimeout(() => setShowBubble(true), 1000);
      }

      if (currentScreen === 0 && Math.random() > 0.7) {
        spawnParticle(x, y);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [currentScreen, showBubble]);

  const spawnParticle = (x, y) => {
    const container = document.getElementById('s0');
    if (!container) return;
    const p = document.createElement('div');
    p.className = 'particle';
    const colors = ['#ff69b4', '#a855f7', '#facc15', '#34d399', '#60a5fa'];
    const size = 4 + Math.random() * 6;
    p.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${0.5 + Math.random() * 0.8}s;
      transform: translate(${(Math.random() - 0.5) * 60}px, ${(Math.random() - 0.5) * 60}px);
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  };

  // Sunrise
  const triggerSunrise = () => {
    const s3 = document.getElementById('s3');
    if (s3) s3.style.background = 'radial-gradient(ellipse at 50% 100%, #1a0a00 0%, #3d1a00 30%, #7c3000 60%, #000 100%)';
    setTimeout(() => setSunRisen(true), 300);
    setTimeout(() => {
      setSunriseVisible(true);
      launchConfetti();
    }, 2800);
  };

  // Confetti
  const launchConfetti = useCallback(() => {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    const colors = ['#ff69b4', '#a855f7', '#facc15', '#34d399', '#60a5fa', '#f87171', '#fb923c'];
    for (let i = 0; i < 80; i++) {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.cssText = `
        left: ${Math.random() * 100}%;
        top: -10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${6 + Math.random() * 10}px;
        height: ${6 + Math.random() * 10}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${2 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 1.5}s;
      `;
      container.appendChild(c);
    }
    setTimeout(() => { container.innerHTML = ''; }, 6000);
  }, []);

  // Verificar edad
  const checkAge = () => {
    const val = parseInt(ageInput);
    if (!val || isNaN(val)) {
      setAgeError('Por favor ingresa tu edad');
      return;
    }
    if (val === 29) {
      showModal(
        'Mmm... necesito verificarlo mejor 🤔',
        'Tienes 29... pero hay muchas personas con 29 años. ¡Dame tu año de nacimiento!',
        () => goToScreen(2),
        '¡Dale, verificar!'
      );
    } else {
      showModal(
        `❌ Calculé ${val} años`,
        `Eso no cuadra con los años de Natalie... ¿Quieres intentarlo de nuevo?`,
        () => goToScreen(1),
        '¡Sí, intento de nuevo!'
      );
    }
  };

  // Año
  const changeYear = (dir) => {
    let newYear = selectedYear + dir;
    if (newYear < 1950) newYear = 1950;
    if (newYear > 2025) newYear = 2025;
    setSelectedYear(newYear);
  };

  const checkYear = () => {
    const age = 2026 - selectedYear;
    if (age === 29) {
      goToScreen(3);
    } else {
      showModal(
        `❌ El cálculo da ${age} años`,
        `Eso no cuadra con Natalie... ¿Quieres intentarlo de nuevo?`,
        () => goToScreen(2),
        '¡Sí, intento!'
      );
    }
  };

  // Regalos
  const chooseGift = (color) => {
    setGiftChoice(color);
    goToScreen(5);
  };

  const correctGift = () => {
    goToScreen(6);
  };

  const openGift = () => {
    launchConfetti();
    goToScreen(7);
    startLemonReveal();
  };

  const startLemonReveal = () => {
    setIsCounting(true);
    setCountdown(10);
    setTimeout(() => {
      const num = document.getElementById('countdown-num');
      if (num) num.style.display = 'block';
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          const newVal = prev - 1;
          if (newVal <= 0) {
            clearInterval(countdownIntervalRef.current);
            setTimeout(() => goToScreen(8), 400);
            return 0;
          }
          const numEl = document.getElementById('countdown-num');
          if (numEl) {
            numEl.style.animation = 'none';
            void numEl.offsetWidth;
            numEl.style.animation = 'countPop 0.3s ease';
          }
          return newVal;
        });
      }, 1000);
    }, 2000);
  };

  // Caja de chocolate
  const getBoxEmoji = (clicks) => {
    const boxStates = ['🎁', '💀'];
    const idx = Math.floor((clicks / 29) * (boxStates.length - 1));
    return boxStates[Math.min(idx, boxStates.length - 1)];
  };

  const clickBox = () => {
    if (boxClicks >= 29) return;
    const newClicks = boxClicks + 1;
    setBoxClicks(newClicks);

    const emojiEl = document.getElementById('box-emoji');
    if (emojiEl) {
      emojiEl.textContent = getBoxEmoji(newClicks);
      emojiEl.style.animation = 'none';
      void emojiEl.offsetWidth;
      emojiEl.style.animation = 'shake 0.3s ease';
    }

    addCrack(newClicks);

    if (newClicks === 29) {
      setTimeout(() => {
        launchConfetti();
        goToScreen(9);
      }, 400);
    }
  };

  const addCrack = (clicks) => {
    const overlay = document.getElementById('crack-overlay');
    if (!overlay) return;
    overlay.style.opacity = (clicks / 29) * 0.8;
    const lines = ['╲', '╱', '✕', '╳', '⚡', '×', '✗'];
    const span = document.createElement('span');
    span.textContent = lines[Math.floor(Math.random() * lines.length)];
    span.style.cssText = `
      position: absolute;
      left: ${10 + Math.random() * 80}%;
      top: ${10 + Math.random() * 80}%;
      font-size: ${12 + Math.random() * 16}px;
      color: rgba(168, 85, 247, ${0.3 + Math.random() * 0.5});
    `;
    overlay.appendChild(span);
  };

  // Efecto para estrellas al cambiar de pantalla
  useEffect(() => {
    if (currentScreen === 0) buildStars('stars0');
    if (currentScreen === 1) buildStars('stars1');
    if (currentScreen === 2) buildStars('stars2');
    if (currentScreen === 4) buildStars('stars4');
  }, [currentScreen, buildStars]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Renderizar pantallas
  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return (
          <div className="screen active">
            <div className="serpentine-track">
              <div className="stars-bg" id="stars0"></div>
              <div className="snak" style={{ top: '18%' }}>✨ ey tu ✨ ey tu ✨ ey tu ✨ ey tu ✨ ey tu ✨ ey tu ✨</div>
              <div className="snak snak2" style={{ top: '36%' }}>🎉 feliz cumpleaños 🎉 feliz cumpleaños 🎉 feliz cumpleaños 🎉</div>
              <div className="snak snak3" style={{ top: '54%' }}>🌟 ey tu 🌟 ey tu 🌟 ey tu 🌟 ey tu 🌟 ey tu 🌟</div>
              <div className="snak" style={{ top: '72%', animationDuration: '9s', color: '#34d399', textShadow: '0 0 10px #34d399' }}>💫 feliz cumpleaños 💫 feliz cumpleaños 💫 feliz cumpleaños</div>
            </div>
            <div
              className="mouse-follow"
              style={{
                left: `${mousePos.x - 20}px`,
                top: `${mousePos.y - 20}px`
              }}
            >
              🐭
            </div>
            <div
              className={`mouse-bubble ${showBubble ? 'visible' : ''}`}
              style={{
                left: `${mousePos.x + 20}px`,
                top: `${mousePos.y - 40}px`
              }}
            >
              ¿Eres tú, Natalie? 👀
            </div>
            <div className="content-z" style={{ pointerEvents: 'auto' }}>
              <div className="glow-title">Ratalie 🐭</div>
              <p className="sub-text">Mueve el mouse...</p>
              <button className="btn-main" onClick={() => goToScreen(1)}>¡Soy yo, continuar! ✨</button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="screen active">
            <div className="stars-bg" id="stars1"></div>
            <div className="content-z" style={{ gap: '14px' }}>
              <div className="glow-title slide-up">¿Cuántos años cumples hoy? 🎂</div>
              <p className="sub-text slide-up-2">Tengo que verificar que eres tú...</p>
              <input
                type="number"
                className="dark-input slide-up-2"
                placeholder="Escribe tu edad"
                min="1"
                max="120"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkAge()}
              />
              <div className="error-msg">{ageError}</div>
              <button className="btn-main slide-up-3" onClick={checkAge}>Verificar 🔍</button>
            </div>
          </div>
        );

      case 2:
        const age = 2026 - selectedYear;
        return (
          <div className="screen active">
            <div className="stars-bg" id="stars2"></div>
            <div className="content-z" style={{ gap: '16px' }}>
              <div className="glow-title slide-up" style={{ fontSize: '36px' }}>¿En qué año naciste? 📅</div>
              <p className="sub-text slide-up-2">Mueve las flechas hasta tu año</p>
              <div className="year-selector slide-up-3">
                <button className="arrow-btn" onClick={() => changeYear(1)}>▲</button>
                <div className="year-display" style={{ color: '#ff69b4' }}>{selectedYear}</div>
                <button className="arrow-btn" onClick={() => changeYear(-1)}>▼</button>
              </div>
              <div className="error-msg">{yearError}</div>
              <button className="btn-main" onClick={checkYear}>Confirmar 🎯</button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="screen active" id="s3">
            <div className={`sun-container ${sunRisen ? 'risen' : ''}`} id="sun-container">
              <div className="sun-rays"></div>
              <div className="sun-circle"></div>
            </div>
            <div className="content-z">
              <div className={`sunrise-msg ${sunriseVisible ? 'visible' : ''}`} id="sunrise-msg">
                <div className="bday-big slide-up">🎉 ¡Feliz Cumpleaños! 🎉</div>
                <p className="sub-text slide-up-2" style={{ fontSize: '20px' }}>¡Sabía que eras tú, Natalie! 🥳</p>
                <button className="btn-main slide-up-3" onClick={() => goToScreen(4)}>¡Ver mi regalo! 🎁</button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="screen active">
            <div className="stars-bg" id="stars4"></div>
            <div className="content-z" style={{ gap: '28px' }}>
              <div className="glow-title slide-up" style={{ fontSize: '38px' }}>🎁 Elige un regalo</div>
              <p className="sub-text slide-up-2">Escoge el que más te guste...</p>
              <div className="gifts-row slide-up-3">
                <div className="gift-card gift-left" onClick={() => chooseGift('azul')}>
                  <span className="gift-emoji">🎀</span>
                  <span className="gift-label" style={{ color: '#60a5fa' }}>Azul</span>
                </div>
                <div className="gift-card gift-right" onClick={() => chooseGift('rojo')}>
                  <span className="gift-emoji">🎁</span>
                  <span className="gift-label" style={{ color: '#f87171' }}>Rojo</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="screen active">
            <div className="content-z" style={{ gap: '20px' }}>
              <div className="jaja-text">Jajaja ese no 😂</div>
              <p className="sub-text" style={{ fontSize: '18px' }}>Selecciona el otro...</p>
              <div className="gifts-row">
                <div
                  className="gift-card"
                  style={{
                    borderColor: '#facc15',
                    boxShadow: '0 0 30px rgba(250,204,21,0.4)',
                    animation: 'floatGift 2s ease-in-out infinite'
                  }}
                  onClick={correctGift}
                >
                  <span className="gift-emoji" style={{ animation: 'spin 3s linear infinite', display: 'block' }}>🎁</span>
                  <span className="gift-label" style={{ color: '#facc15' }}>¡Este! ✨</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="screen active">
            <div className="content-z" style={{ gap: '16px' }}>
              <div className="glow-title slide-up" style={{ fontSize: '36px' }}>¡Tu regalo, Natalie! 🎊</div>
              <div className="cake-wrap">🎂</div>
              <p className="sub-text slide-up" style={{ fontSize: '20px' }}>
                ¡<span className="candle-flicker">🕯</span> Feliz Cumpleaños! <span className="candle-flicker" style={{ animationDelay: '0.1s' }}>🕯</span>
              </p>
              <button className="btn-main slide-up-2" onClick={openGift}>Abrir regalo 🎁</button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="screen active">
            <div className="reveal-box content-z" style={{ gap: '12px' }}>
              <div className="glow-title slide-up" style={{ fontSize: '30px' }}>Tu regalo es... 🥁</div>
              <img
                id="lemon-img"
                src="limon.jpg"
                alt=""
                className="lemon-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const emoji = document.getElementById('lemon-emoji');
                  if (emoji) emoji.style.display = 'block';
                }}
              />
              <div id="lemon-emoji" style={{ fontSize: '100px', display: 'none', animation: 'spin 8s linear infinite' }}>🍋</div>
              <p style={{ color: '#facc15', fontWeight: '700', fontSize: '18px' }}>¡Un limóoooon! 😂</p>
              <p style={{ color: '#aaa', fontSize: '14px' }} id="countdown-label">
                {isCounting ? 'Algo más llega en:' : 'Espera un momento...'}
              </p>
              {isCounting && (
                <div className="countdown-txt" id="countdown-num">{countdown}</div>
              )}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="screen active">
            <div className="content-z" style={{ gap: '20px' }}>
              <div className="glow-title slide-up" style={{ fontSize: '34px' }}>Jaja es broma 😄</div>
              <p className="sub-text slide-up-2">
                ¡Tu verdadero regalo! Da clic <strong style={{ color: '#ff69b4' }}>29 veces</strong> para abrirlo...
              </p>
              <div className="choco-gift-btn slide-up-3" id="choco-box" onClick={clickBox}>
                <div className="crack-overlay" id="crack-overlay"></div>
                <span className="box-emoji" id="box-emoji">🎁</span>
                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
                  Clics: <span id="click-count">{boxClicks}</span>/29
                </p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(boxClicks / 29) * 100}%` }}></div>
                </div>
                <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>¡Dale duro! 💪</p>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="screen active">
            <div className="choco-reveal content-z" style={{ gap: '14px' }}>
              <div className="glow-title slide-up" style={{ fontSize: '32px' }}>🍫 ¡Tu verdadero regalo! 🍫</div>
              <img
                id="choco-img"
                src="chocolate.jpg"
                alt=""
                className="choco-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const emoji = document.getElementById('choco-emoji');
                  if (emoji) emoji.style.display = 'block';
                }}
              />
              <div id="choco-emoji" style={{ fontSize: '100px', display: 'none', animation: 'heartBeat 1.5s ease-in-out infinite' }}>🍫</div>
              <p style={{ color: '#e9d5ff', fontSize: '18px', fontWeight: '700' }}>¡Este chocolate es para ti, Natalie! ❤️</p>
              <p style={{ color: '#aaa', fontSize: '14px' }}>Que cumplas muchos más con salud, amor y felicidad ✨</p>
              <button className="btn-main" onClick={resetGame}>¡Repetir desde el inicio! 🔄</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="app">
      <div id="confetti-container" ref={confettiContainerRef}></div>
      {renderScreen()}

      {modalData && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{modalData.title}</h2>
            <p>{modalData.text}</p>
            <button className="btn-modal" onClick={modalYes}>
              {modalData.yesText || '¡Sí, intento de nuevo!'}
            </button>
            <button className="btn-modal secondary" onClick={modalNo}>
              No soy Natalie 😢
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;