import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserDashboard from '../components/UserDashboard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, getDocs, addDoc } from 'firebase/firestore';

// Mocking Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getFirestore: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
}));

beforeEach(() => {
  getAuth.mockReturnValue({});
  onAuthStateChanged.mockReturnValue(jest.fn()); //this is mocking the unsubscribe function
  getFirestore.mockReturnValue({});
  getDocs.mockResolvedValue({
    forEach: jest.fn()
  });
});

afterEach(() => {
    jest.clearAllMocks();
  });

/* 
TEMPLATE:
describe(Group, () =>{(
    it('does something'), () => {(
        //test
    });
});
*/
describe('UserDashboard', () => {  //Test Suite #1
    //This test checks if the page will render successfully
    it('renders without crashing', () => {                                 //Test #1
    render(<UserDashboard />);       
  });

  //This test checks if the Ticket subject and description successfully update on the database upon submission
  it('submits the form with ticket data', async () => {                  //Test #2
    const { getByLabelText, getByText } = render(<UserDashboard />);

    fireEvent.change(getByLabelText(/subject/i), {
      target: { value: 'Ticket Subject Test' }
    });
    fireEvent.change(getByLabelText(/description/i), {
      target: { value: 'Ticket Description Test' }
    });
    fireEvent.click(getByText(/submit ticket/i));

    await waitFor(() => {
      expect(getByLabelText(/subject/i).value).toBe('Ticket Subject Test');
      expect(getByLabelText(/description/i).value).toBe('Ticket Description Test');
    });
  });
  
  it('submits a ticket correctly', async () => {                         //Test #3
    const mockDate = new Date();
    global.Date = jest.fn(() => mockDate);
    
    const mockTicketData = {
      userId: 'testUser',
      companyId: 'company1',
      subject: 'Test Subject',
      description: 'Test Description',
      status: 'open',
      created: mockDate,
      isVisible: true
    };

    addDoc.mockResolvedValueOnce({});

    const { getByLabelText, getByText } = render(<UserDashboard userId="testUser" companyId="company1"/>);  //props userID and companyID
    fireEvent.change(getByLabelText(/subject/i), { target: { value: 'Test Subject' } });         //simulate user input
    fireEvent.change(getByLabelText(/description/i), { target: { value: 'Test Description' } });  //simulate user input
    fireEvent.click(getByText(/submit ticket/i));  

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), mockTicketData);
    });
  });

});




