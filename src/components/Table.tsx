import React, { useCallback, useEffect, useState } from 'react';
import '../styles/Table.css';
import { Employee } from '../types/Employee';
import ChevronDown from '../assets/images/charm_chevron-down.svg';
import ChevronUp from '../assets/images/charm_chevron-up.svg';
import InputSearch from './InputSearch';

const Table = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {}
  );

  const formatDate = useCallback((date: string) => {
    const [year, month, day] = date.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }, []);

  const formatPhone = useCallback((phone: string) => {
    const ddd = phone.slice(0, 2);
    const firstPart = phone.slice(2, 7);
    const secondPart = phone.slice(7, 11);
    return `(${ddd}) ${firstPart}-${secondPart}`;
  }, []);

  const formatted = useCallback(
    (data: Employee[]) => {
      const formattedData = data.map((employee: Employee) => {
        return {
          ...employee,
          admission_date: formatDate(employee.admission_date),
          phone: formatPhone(employee.phone),
        };
      });

      return formattedData;
    },
    [formatDate, formatPhone]
  );

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/employees');
      const data = await response.json();
      const newData = formatted(data);
      setEmployees(newData);
    } catch (error) {
      console.error('Erro:', error);
    }
  }, [formatted]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <main className="container">
      <section className="title">
        <h1>Funcionários</h1>
        <InputSearch
          type="text"
          id="search"
          name="search"
          value={search}
          placeholder="Pesquisar"
          className="search"
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <table>
        <thead>
          <tr>
            <th>FOTO</th>
            <th>NOME</th>
            <th className="desktop-only">CARGO</th>
            <th className="desktop-only">DATA DE ADMISSÃO</th>
            <th className="desktop-only">TELEFONE</th>
            <th className="mobile-only">
              <span className="icon-circle"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {employees
            .filter((employee: Employee) => {
              return (
                search === '' ||
                employee.name.toLowerCase().includes(search.toLowerCase()) ||
                employee.job.toLowerCase().includes(search.toLowerCase()) ||
                employee.admission_date
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                employee.phone.toLowerCase().includes(search.toLowerCase())
              );
            })
            .map((employee: Employee) => (
              <>
                <tr
                  className={`${expandedRows[employee.id] ? 'expanded' : ''}`}
                  key={employee.id}
                >
                  <td>
                    <img
                      src={employee.image}
                      alt={`Foto de ${employee.name}`}
                      className="avatar"
                    />
                  </td>
                  <td>{employee.name}</td>
                  <td className="mobile-only">
                    <button
                      type="button"
                      className="expand-button"
                      onClick={() =>
                        setExpandedRows({
                          ...expandedRows,
                          [employee.id]: !expandedRows[employee.id],
                        })
                      }
                    >
                      <img
                        src={
                          expandedRows[employee.id] ? ChevronUp : ChevronDown
                        }
                        alt={expandedRows[employee.id] ? 'Fechar' : 'Expandir'}
                        className="chevron-icon"
                      />
                    </button>
                  </td>
                  <td className="desktop-only">{employee.job}</td>
                  <td className="desktop-only">{employee.admission_date}</td>
                  <td className="desktop-only">{employee.phone}</td>
                </tr>

                {expandedRows[employee.id] && (
                  <tr>
                    <td colSpan={6}>
                      <div className="employee-info">
                        <p>
                          <strong>Cargo:</strong>
                        </p>
                        <p>{employee.job}</p>
                      </div>
                      <div className="employee-info">
                        <p>
                          <strong>Data de admissão:</strong>
                        </p>
                        <p>{employee.admission_date}</p>
                      </div>
                      <div className="employee-info">
                        <p>
                          <strong>Telefone:</strong>
                        </p>
                        <p>{employee.phone}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
        </tbody>
      </table>
    </main>
  );
};

export default Table;
