import React, { useState, useEffect, useContext } from 'react';
import LandingNavbar from '../layout/LandingNavbar';
import '../styles/landing-page.css';
import '../styles/navbar.css';
import { MainContext } from '../context/context';

export default function LandingPage() {
  const { main } = useContext(MainContext);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleFirst, setVisibleFirst] = useState(true);
  const [visibleSecond, setVisibleSecond] = useState(true);
  const phrases = [
    { first: 'Work', second: 'Together' },
    { first: 'Earn', second: 'Together' },
    { first: 'Save', second: 'Forever' },
  ];

  useEffect(() => {
    main.dispatch({
      type: 'LOGOUT',
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (phraseIndex === 0) {
        setVisibleFirst(false);
        setTimeout(() => {
          setPhraseIndex(1);
          setVisibleFirst(true);
        }, 1000);
      } else {
        setVisibleFirst(false);
        setVisibleSecond(false);
        setTimeout(() => {
          setPhraseIndex((current) => (current + 1) % phrases.length);
          setVisibleFirst(true);
          setVisibleSecond(true);
        }, 1000);
      }
    }, 2300);
    return () => {
      clearInterval(interval);
    };
  }, [phraseIndex]);

  return (
    <>
      <LandingNavbar />
      <div className="landing-page">
        <h1 className="hero-heading">
          <div className="tagline">
            <div
              className={`word first-word ${
                visibleFirst ? 'flip-visible' : 'flip-invisible'
              }`}
              style={{ textAlign: 'right' }}
            >
              {' '}
              {phrases[phraseIndex].first}
            </div>
            <div
              className={`word second-word ${
                visibleSecond ? 'flip-visible' : 'flip-invisible'
              }`}
            >
              {' '}
              {phrases[phraseIndex].second}
            </div>
          </div>
        </h1>
        <img
          src="/hero-image.png"
          alt="illustration of a family managing finances together"
        />
      </div>
    </>
  );
}
