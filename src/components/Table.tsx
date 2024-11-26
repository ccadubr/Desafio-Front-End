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
    const countryCode = phone.slice(0, 2);
    const ddd = phone.slice(2, 4);
    const firstPart = phone.slice(4, 9);
    const secondPart = phone.slice(9);
    return `+${countryCode} ${ddd} ${firstPart}-${secondPart}`;
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
        <h1>
          <strong>Funcionários</strong>
        </h1>
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
            <th>
              <h2>FOTO</h2>
            </th>
            <th className="name-column">
              <h2>NOME</h2>
            </th>
            <th className="desktop-only">
              <h2>CARGO</h2>
            </th>
            <th className="desktop-only">
              <h2>DATA DE ADMISSÃO</h2>
            </th>
            <th className="desktop-only">
              <h2>TELEFONE</h2>
            </th>
            <th className="mobile-only">
              <div className="container-circle">
                <span className="icon-circle"></span>
              </div>
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
                  <td>
                    <h3>{employee.name}</h3>
                  </td>
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
                        width={32}
                        height={32}
                        className="chevron-icon"
                      />
                    </button>
                  </td>
                  <td className="desktop-only">
                    <h3>{employee.job}</h3>
                  </td>
                  <td className="desktop-only">
                    <h3>{employee.admission_date}</h3>
                  </td>
                  <td className="desktop-only">
                    <h3>{employee.phone}</h3>
                  </td>
                </tr>

                {expandedRows[employee.id] && (
                  <tr className="mobile-only">
                    <td colSpan={6}>
                      <div className="employee-info">
                        <h2>
                          <strong>Cargo</strong>
                        </h2>
                        <h3>{employee.job}</h3>
                      </div>
                      <div className="employee-info">
                        <h2>
                          <strong>Data de admissão</strong>
                        </h2>
                        <h3>{employee.admission_date}</h3>
                      </div>
                      <div className="employee-info">
                        <h2>
                          <strong>Telefone</strong>
                        </h2>
                        <h3>{employee.phone}</h3>
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
