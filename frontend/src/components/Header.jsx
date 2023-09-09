import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    window.location.reload(); // Reload the page
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className='header'>
        <nav>
          <div className='logo'>
           
            {user ? (
                  <>
                    <h2>ITR {user.branch}</h2> 
                  </>
                ) : (
                  <>
                  <h2>ITR</h2>
                  </>
                )}
          </div>
          <div className='links'>
            {user && (
              <div className='middle-links'>
                <ul>
                  <li>
                    <Link to='/health'>Health</Link>
                  </li>
                  <li>
                    <Link to='/property'>Property</Link>
                  </li>
                  <li>
                    <Link to='/privatevc'>PrivateVehicle/Comprehensive</Link>
                  </li>
                  <li>
                    <Link to='/privatevtp'>PrivateVehicle/Third Party</Link>
                  </li>
                  <li>
                    <Link to='/commercialvc'>Commercial Vehicle/ Comprehensive</Link>
                  </li>
                  <li>
                    <Link to='/commercialvtp'>Commercial Vehicle/third Party</Link>
                  </li>
                  <li>
                    <Link to='/register'>New Client</Link>
                  </li>
                </ul>
              </div>
            )}

            <div className='auth-links'>
              <ul>
              <Link to="/payment">
                  <button style={{ cursor: 'pointer', color: '#ffff'}}>Transact Here</button>
              </Link>
                {user ? (
                  <>
                    <li>
                    <Link to="/">
                      <button style={{ cursor: 'pointer',  color: '#ffff'}} onClick={onLogout}>Logout</button>
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                 
                  </>
                )}
               
              </ul>
            </div>
          </div>
          <div className="menu" onClick={toggleMenu}>
            <h2>Menu</h2>
          </div>
          {isMenuOpen && user && (
            <div className='mobile-links' onClick={toggleMenu}>
                <ul>
                  <li>
                    <Link to='/health'>Health</Link>
                  </li>
                  <li>
                    <Link to='/property'>Property</Link>
                  </li>
                  <li>
                    <Link to='/privatevc'>PrivateVehicle/Comprehensive</Link>
                  </li>
                  <li>
                    <Link to='/privatevtp'>PrivateVehicle/Third Party</Link>
                  </li>
                  <li>
                    <Link to='/commercialvc'>Commercial Vehicle/ Comprehensive</Link>
                  </li>
                  <li>
                    <Link to='/commercialvtp'>Commercial Vehicle/third Party</Link>
                  </li>
                  <li>
                    <Link to='/register'>New Client</Link>
                  </li>
                </ul>
            </div>
          )}
          
        </nav>
      </div>
    </>
  );
}

export default Header;
