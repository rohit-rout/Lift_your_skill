import React from 'react'
import { Link } from 'react-router-dom';
import "./Header.css"
const Header = () => {
  return (
    <>
  
      <div className="head">
        <ul>
          <li><Link className="link" to="/products">Courses </Link></li>
          <li><Link className="link" to="/search">Search </Link></li>
          <li><Link className="link" to="/loginSignUp">Login/SignUp</Link></li>
          <li><Link className="link" to="/">Home</Link></li>
         
          
        </ul>
      </div>
    </>
  )
}

export default Header