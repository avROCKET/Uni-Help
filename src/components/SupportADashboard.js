import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getDoc, getFirestore, collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import Tickets from './Tickets';
import ChatModal from './ChatModal';

const db = getFirestore();

const SupportADashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const role = await fetchUserRole(user.uid); 
        setUserRole(role);
        const name = await fetchUserName(user.uid);
        setUserName(name); 
      } else {
        setUserId(null);
        setUserRole(null); 
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);
  
  const fetchUserRole = async (userId) => {
    const userDocRef = doc(getFirestore(), 'users', userId);
    const userDoc = await getDoc(userDocRef);
    console.log("fetched user role:", userDoc.data().role);
    return userDoc.data().role;
  };

  const fetchUserName = async (userId) => {
    const userDocRef = doc(getFirestore(), 'users', userId);
    const userDoc = await getDoc(userDocRef);
    console.log("fetched user role:", userDoc.data().name);
    return userDoc.data().name;
  };


  useEffect(() => {
    const ticketsQuery = query(collection(db, 'tickets'), where('assignedTo', '==', 'SupportA'));
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
          senderName: userName,
          senderRole: userRole,
        });
        console.log('selected ticket id:', selectedTicket);
      } catch (error) {
        console.error('Error sending message:', error);
        
      }
    }
  };

  const handleEscalateTicket = async (ticketId) => {
    console.log('escalate Here: ' + ticketId)
    try {
      //first check if there are higher support level accounts that the ticket can be escalated to
      const ticketRef = doc(db, 'tickets', ticketId);
      const ticketDoc = await getDoc(ticketRef)
      const companyId = ticketDoc.data().companyId

      await updateDoc(ticketRef, { assignedTo: 'SupportB' });
    } catch (error) {
      console.error('Error escalating ticket:', error);
    }
  }

  return (

    <div className="dashboard-container">
      <h1 className="dashboard-header">Support A Dashboard</h1>
      <div className="tickets-container">
        <Tickets
          tickets={tickets}
          onTicketClick={handleTicketClick}
          onCloseTicket={handleCloseTicket}
          onEscalateTicket={handleEscalateTicket}
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

export default SupportADashboard;
