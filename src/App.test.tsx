import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the employee table', async () => {
  render(<App />);

  global.fetch = jest.fn(() =>
    Promise.resolve(
      new Response(
        JSON.stringify([
          {
            id: '1',
            name: 'João',
            job: 'Frontend Developer',
            admission_date: '2021-01-01',
            phone: '5551234567890',
            image: 'https://example.com/image.jpg',
          },
        ]),
        {
          status: 200,
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
    )
  );

  const titleElement = screen.getByText(/Funcionários/i);
  expect(titleElement).toBeInTheDocument();

  const tableElement = screen.getByRole('table');
  expect(tableElement).toBeInTheDocument();

  const employeeName = await screen.findByText(/João/i);
  expect(employeeName).toBeInTheDocument();
});
