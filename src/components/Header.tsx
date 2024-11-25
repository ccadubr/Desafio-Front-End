import React from 'react';
import img from '../assets/images/Logo.svg';
import '../styles/Header.css';

const Header = () => {
  return (
    <header>
      <img src={img} alt="logo" />
    </header>
  );
};

export default Header;
