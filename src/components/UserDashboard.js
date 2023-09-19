import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, addDoc, getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const db = getFirestore();

const UserDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [userId, setUserId] = useState(null);
  const [formState, setFormState] = useState({ companyID: '', subject: '', description: '' });
  const [tickets, setTickets] = useState([]);

  const fetchCompanies = async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'company'));
      const querySnapshot = await getDocs(q);
      const companiesArray = [];
      querySnapshot.forEach((doc) => {
        companiesArray.push({ id: doc.id, ...doc.data() });
      });
      setCompanies(companiesArray);
    } catch (error) {
      console.error('Error fetching companies: ', error);
    }
  };
  
  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    
    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, []);

  const fetchTickets = async () => {
    try {
      if (userId) {
        const q = query(collection(db, 'tickets'), where('userId', '==', userId), where('isVisible', '==', true));
        const querySnapshot = await getDocs(q);
        const ticketsArray = [];
        querySnapshot.forEach((doc) => {
          ticketsArray.push({ id: doc.id, ...doc.data() });
        });
        setTickets(ticketsArray);
      }
    } catch (error) {
      console.error('Error fetching tickets: ', error);
    }
  };
  
  useEffect(() => {
    fetchTickets();
  }, [userId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Create a new ticket in the Firestore database
      const ticketData = {
      userId: userId,  // Now using the actual user ID
      companyId: formState.companyID,
      subject: formState.subject,
      description: formState.description,
      status: 'open',
      created: new Date(),
      isVisible: true,
    };
  
      await addDoc(collection(db, 'tickets'), ticketData);
      
      alert('Ticket submitted successfully');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Error submitting ticket');
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { status: 'closed' });
      // fetch tickets again to reflect the change in UI
      fetchTickets();
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };
  
  const handleHideTicket = async (ticketId) => {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { isVisible: false });
      // fetch tickets again to reflect the change in UI
      fetchTickets();
    } catch (error) {
      console.error('Error hiding ticket:', error);
    }
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      
      <form onSubmit={handleSubmit}>
      <label>
        Company
        <select name="companyID" value={formState.companyID} onChange={handleInputChange}>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </label>
        <br />
        <label>
          Subject
          <input type="text" name="subject" value={formState.subject} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Description
          <textarea name="description" value={formState.description} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Submit Ticket</button>
      </form>
      <h2>Your Tickets</h2>
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              {ticket.subject} - {ticket.status}
              <button onClick={() => handleCloseTicket(ticket.id)}>Close</button>
              <button onClick={() => handleHideTicket(ticket.id)}>Hide</button>
            </li>
          ))}
        </ul>
    </div>
  );
}

export default UserDashboard;
