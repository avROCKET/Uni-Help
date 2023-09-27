import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const db = getFirestore();

const SupportCDashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const ticketsQuery = query(collection(db, 'tickets'), where('assignedTo', '==', 'SupportC'));
    onSnapshot(ticketsQuery, (querySnapshot) => {
      const ticketsArray = [];
      querySnapshot.forEach((doc) => {
        ticketsArray.push({ id: doc.id, ...doc.data() });
      });
      setTickets(ticketsArray);
    });
  }, []);

  return (
    <div>
      <h1>Support C Dashboard</h1>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>
            {ticket.subject} - {ticket.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupportCDashboard;
