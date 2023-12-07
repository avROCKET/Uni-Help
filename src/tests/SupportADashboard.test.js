import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tickets from '../components/Tickets';

describe('Tickets Component', () => {
  it('displays assigned and unassigned tickets for reviewer role', () => {
    const mockTickets = [{ /* ...mock ticket data... */ }];
    render(<Tickets tickets={mockTickets} role="reviewer" />);

    expect(screen.getByText('Assigned Tickets')).toBeInTheDocument();
    expect(screen.getByText('Unassigned Tickets')).toBeInTheDocument();
  });

  it('displays inquiries for user role', () => {
    const mockTickets = [{ /* ...mock ticket data... */ }];
    render(<Tickets tickets={mockTickets} role="user" />);

    expect(screen.getByText('My Inquiries')).toBeInTheDocument();
  });

  it('renders tickets for support role without specific headers', () => {
    const mockTickets = [{ /* ...mock ticket data... */ }];
    render(<Tickets tickets={mockTickets} role="support" />);
    
    expect(screen.queryByText('My Workqueue')).toBeInTheDocument();
  });
});
