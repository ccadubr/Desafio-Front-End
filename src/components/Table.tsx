import React, { useEffect, useState } from 'react';
import '../styles/Table.css';
import { Employee } from '../types/Employee';

const Table = () => {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3001/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <section className="container-table">
      <h1>Funcionários</h1>
      <input
        type="text"
        placeholder="Pesquisar"
        aria-label="Pesquisar funcionários"
        className="search"
      />

      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee: Employee) => (
            <tr key={employee.id}>
              <td>
                <img
                  src={employee.image}
                  alt={`Foto de ${employee.name}`}
                  className="avatar"
                />
              </td>
              <td>{employee.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Table;
