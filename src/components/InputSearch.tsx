import React from 'react';
import { IinputSearch } from '../interfaces/IinputSearch';
import '../styles/InputSearch.css';
import icon from '../assets/images/Default.svg';

const InputSearch = (props: IinputSearch) => {
  return (
    <div className="container-input">
      <input {...props} />
      <label htmlFor={props.id} className="search-label">
        {props.placeholder}
      </label>
      <img src={icon} className="search-icon" alt="Ícone de pesquisa" />
    </div>
  );
};

export default InputSearch;
