import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getFirestore, collection, query, where, getDoc, onSnapshot } from 'firebase/firestore';
import Tickets from './Tickets';
import Modal from './Modal';


const db = getFirestore();

const ReviewerDashboard = () => {  
  const [tickets, setTickets] = useState([]);
  const [selectedSupportLevel, setSelectedSupportLevel] = useState('SupportA');
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeChatMessages, setActiveChatMessages] = useState([]);


  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      getDoc(userRef).then(docSnapshot => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const userCompanyId = userData.companyId;

          const ticketsQuery = query(collection(db, 'tickets'), where('companyId', '==', userCompanyId));
          onSnapshot(ticketsQuery, (querySnapshot) => {
            const ticketsArray = [];
            querySnapshot.forEach((doc) => {
              ticketsArray.push({ id: doc.id, ...doc.data() });
            });
            setTickets(ticketsArray);
          });
        }
      });
    }
  }, [currentUser]);

  const handleAssignTicket = async (ticketId) => {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { assignedTo: selectedSupportLevel });
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  const handleTicketClick = (ticketId) => {
    const messagesQuery = query(collection(doc(db, 'tickets', ticketId), 'messages'));

    onSnapshot(messagesQuery, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            messages.push(doc.data());
        });
        setActiveChatMessages(messages);
    });
    setModalOpen(true);
};


  return (
    <div>
      <h1>Reviewer Dashboard</h1>
      <select value={selectedSupportLevel} onChange={e => setSelectedSupportLevel(e.target.value)}>
        <option value="SupportA">Support A</option>
        <option value="SupportB">Support B</option>
        <option value="SupportC">Support C</option>
      </select>
      <Tickets
          tickets={tickets}
          onTicketClick={handleTicketClick}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
      <h2>Messages</h2>
        {activeChatMessages.map((message, index) => (
            <div key={index}>{message.content}</div>
        ))}
    </Modal>
    </div>
  );
};

//mesages sucessfully link with support and user

export default ReviewerDashboard;
