import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompanyDashboard from '../components/CompanyDashboard';
import { AuthContext } from '../utils/AuthContext';
import * as authFunctions from '../utils/authFunctions';
import * as dataFunctions from '../utils/dataFunctions';

jest.mock('../utils/authFunctions');
jest.mock('../utils/dataFunctions');
window.alert = jest.fn();

describe('CompanyDashboard', () => {
  it('creates an employee account', async () => {
    // Mocking the context and functions
    const mockUser = {user: "user123"}
    const mockUserData = { role: 'company', uid: 'company123' };
    authFunctions.register.mockResolvedValue(); // Mock the register function
    dataFunctions.getCompanyEmployees.mockResolvedValue([]); // Mock getCompanyEmployees function

    // Render the component
    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={{ user: mockUser, userData: mockUserData }}>
        <CompanyDashboard />
      </AuthContext.Provider>
    );

    // Simulate user input
    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByText('Support Level 1'), { target: { value: 'supporta' } });

    // Simulate form submission
    fireEvent.click(getByText('Create Employee Profile'));

    // Assert that the register function was called with the expected arguments
    await waitFor(() => {
      expect(authFunctions.register).toHaveBeenCalledWith(
        'john@example.com', 'password123', 'John Doe', 'supporta', true, "company123"
      );
    });
  });
});
