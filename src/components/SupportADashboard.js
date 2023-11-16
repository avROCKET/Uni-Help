import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getDoc, getDocs, getFirestore, collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import Tickets from './Tickets';
import ChatModal from './ChatModal';
import AlertModal from './AlertModal';

const db = getFirestore();

const SupportADashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userCompId, setUserCompId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const role = await fetchUserRole(user.uid); 
        setUserRole(role);
        const name = await fetchUserName(user.uid);
        setUserName(name); 
        const companyId = await fetchCompanyId(user.uid);
        setUserCompId(companyId);
      } else {
        setUserId(null);
        setUserRole(null); 
        setUserName(null);
        setUserCompId(null);
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
    console.log("fetched user name:", userDoc.data().name);
    return userDoc.data().name;
  };
  
  const fetchCompanyId = async (userId) => {
    const userDocRef = doc(getFirestore(), 'users', userId);
    const userDoc = await getDoc(userDocRef);
    console.log("fetched user companyID:", userDoc.data().companyId);
    return userDoc.data().companyId;
  };

  useEffect(() => {
    if (userCompId) {
      const ticketsQuery = query(
        collection(db, 'tickets'), 
        where('assignedTo', '==', 'SupportA'),
        where('companyId', '==', userCompId)
      );
      console.log(" user companyID:", userCompId)
  
      onSnapshot(ticketsQuery, (querySnapshot) => {
        const ticketsArray = [];
        querySnapshot.forEach((doc) => {
          ticketsArray.push({ id: doc.id, ...doc.data() });
        });
        setTickets(ticketsArray);
      });
    }
  }, [userCompId]); 

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
  console.log('escalate Here: ' + ticketId);
  setCurrentTicketId(ticketId);
  setConfirmationModalOpen(true);
  }; //moved function to onConfirm below

  const confirmEscalation = async () => {
    if (currentTicketId) {
      try {
        const ticketRef = doc(db, 'tickets', currentTicketId);
        const ticketDoc = await getDoc(ticketRef);
        const companyId = ticketDoc.data().companyId;
        console.log("hendleEscalate compId:", companyId)

        // check for support b and c WITHIN the same company
        const usersRef = collection(db, 'users');
        const supportBQuery = query(usersRef, where('role', '==', 'supportb'), where('companyId', '==', companyId));
        const supportCQuery = query(usersRef, where('role', '==', 'supportc'), where('companyId', '==', companyId));

        const [supportBUsersSnapshot, supportCUsersSnapshot] = await Promise.all([
          getDocs(supportBQuery),
          getDocs(supportCQuery)
        ]);

        // checks if support b or c are available
        if (supportBUsersSnapshot.empty && supportCUsersSnapshot.empty) {
          console.error('No Support B or Support C users available.');
        } else {
          const newAssignedTo = supportBUsersSnapshot.empty ? 'SupportC' : 'SupportB'; // if b is available, send to b elif support b is not available, send to support c, 
          await updateDoc(ticketRef, { assignedTo: newAssignedTo });
          console.log(`escalated to ${newAssignedTo}`);
        }
      } catch (error) {
        console.error('Error escalating ticket:', error);
      }
    }
    setConfirmationModalOpen(false);
  };

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
        <AlertModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={confirmEscalation}
          message="Are you sure you want to escalate this ticket?"
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
