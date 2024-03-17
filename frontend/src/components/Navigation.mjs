import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    // <nav className="global">
    //   <Link to="/">Home</Link> | 
    //   <Link to="/composers"> Composers</Link> | 
    //   <Link to="/catalogues"> Catalogues</Link> |
    //   <Link to="/compositions"> Compositions</Link> |
    //   <Link to="/forms"> Forms </Link> | 
    //   <Link to="/instruments"> Instruments</Link>
    // </nav>

    <>
      <div className="navbar">
        <div className="navbar-start">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            Classical Compositions Database
            </div>
          </div>
          <a className="btn text-xl">Classical Compositions Database</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
              <li><Link to="/">Home</Link> </li>
              <li><Link to="/composers"> Composers</Link> </li>
              <li><Link to="/catalogues"> Catalogues</Link> </li>
              <li><Link to="/compositions"> Compositions</Link> </li>
              <li><Link to="/forms"> Forms </Link> </li>
              <li><Link to="/instruments"> Instruments</Link> </li>
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn">Button</a>
        </div>
    </>

    // <div className="navbar bg-base-100">
    //   <a className="btn btn-ghost text-xl">daisyUI</a>
    // </div>

  );
}

export default Navigation;