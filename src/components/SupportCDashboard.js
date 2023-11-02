import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getFirestore, collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import Tickets from './Tickets';
import ChatModal from './ChatModal';

const db = getFirestore();

const SupportCDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    
    return () => unsubscribe();
  }, []);
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

  const handleTicketClick = (ticketId) => {
    setModalOpen(true);
    
    const selectedTicketDetails = tickets.find(ticket => ticket.id === ticketId); //UPDATE: this gets all ticket data
    setSelectedTicketData(selectedTicketDetails);
    
    const messagesQuery = query(collection(doc(db, 'tickets', ticketId), 'messages'), orderBy('timestamp', 'desc'));
    
    onSnapshot(messagesQuery, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setActiveChatMessages(messages);
      setSelectedTicket(ticketId);
      console.log("Active Chat Messages:", messages)
      console.log("selectedTicket: ", selectedTicket);
    });
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { status: 'closed' });
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };

  const sendMessageToTicket = async (messageContent) => { 
    console.log("Attempting to send message:", messageContent);
    console.log('selected ticket id:', selectedTicket);
    if (selectedTicket) {
      try {
        await addDoc(collection(doc(db, 'tickets', selectedTicket), 'messages'), {
          content: messageContent,
          timestamp: new Date(),
          senderId: userId,
        });
        console.log('selected ticket id:', selectedTicket);
      } catch (error) {
        console.error('Error sending message:', error);
        
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Support C Dashboard</h1>
      <div className="tickets-container">
        <Tickets
          tickets={tickets}
          onTicketClick={handleTicketClick}
          onCloseTicket={handleCloseTicket}
          selectedTicket={selectedTicket}
          role='support'
        />
      </div>
      
      {isModalOpen && (
        <div className="chat-modal-container">
          <ChatModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            messages={activeChatMessages}
            canSendMessage={true} 
            onSendMessage={sendMessageToTicket}
            selectedTicketData={selectedTicketData}
            isClosed={selectedTicketData?.status === 'closed'}
            userId={userId}
          />
        </div>
      )}
    </div>
  );
};

export default SupportCDashboard;
