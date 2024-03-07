import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="global">
        <Link to="/">Home</Link> | 
        <Link to="/composers"> Composers</Link> | 
        <Link to="/catalogues"> Catalogues</Link> |
        <Link to="/compositions"> Compositions</Link> | 
        <Link to="/movements"> Movements </Link> | 
        <Link to="/forms"> Forms </Link> | 
        <Link to="/instruments"> Instruments</Link>
    </nav>
  );
}

export default Navigation;