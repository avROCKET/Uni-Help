import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tickets from '../components/Tickets';

describe('Tickets Component', () => {
  it('displays the dashboard for reviewer role', () => {
    const mockTickets = [{ }];
    render(<Tickets tickets={mockTickets} role="reviewer" />); //adds role "reviewer" to mockTickets

    expect(screen.getByText('Assigned Tickets')).toBeInTheDocument();
    expect(screen.getByText('Unassigned Tickets')).toBeInTheDocument();
  });

  it('displays the dashboard for user role', () => {
    const mockTickets = [{ }];
    render(<Tickets tickets={mockTickets} role="user" />); //adds role "user" to mockTickets

    expect(screen.getByText('My Inquiries')).toBeInTheDocument();
  });

  it('renderTickets function displays the correct elements for support role', () => {
    const mockTickets = [{ userId: 1, ticketNumber: '123', subject: 'Test Subject', status: 'open' }];
    render(<Tickets tickets={mockTickets} role="support" />);

    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Test Subject')).toBeInTheDocument();
  });
});
