// Import libraries
import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

// React component for homepage
function HomePage() {
  return (
    <div>
      <header>
        <h1 className="site-title">
          <img src="violinicon.png" alt="violin icon" width="64px" height="64px" style={{position: 'static'}} />
          <Link to="#">Classical Composition and Recording Exploration</Link>
        </h1>
        <h3> A project by Jacob Barber, Aiden Murphy, and Matthew Menold</h3>
      </header>
      <div className="directory">
        <nav>
          <ul>
            <li><Link to="/composers">Composers</Link></li>
            <li><Link to="/compositions">Compositions</Link></li>
            <li><Link to="/movements">Movements</Link></li>
            <li><Link to="/catalogues">Catalogues</Link></li>
            <li><Link to="/forms">Forms</Link></li>
            <li><Link to="/instruments">Instruments</Link></li>
            <li><Link to="/key_signatures">Key Signatures</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default HomePage;

