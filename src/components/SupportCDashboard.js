import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getDoc, getFirestore, collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import Tickets from './Tickets';
import ChatModal from './ChatModal';

const db = getFirestore();

const SupportCDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [compTickets, setCompTickets] = useState([]);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userCompId, setUserCompId] = useState(null)
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('claimed');
  const [searchID, setSearchID] = useState(null);


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
    console.log("fetched user role:", userDoc.data().name);
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
        where('assignedTo', '==', 'SupportC'),
        where('companyId', '==', userCompId),
        where('claimed', 'in', [userId, ""])
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

  const handleClaimTicket = async (ticketId) => {
    const ticketRef = doc(db, 'tickets', ticketId);
    try {
      await updateDoc(ticketRef, { claimed: userId });
      console.log(`Ticket ${ticketId} claimed by user ${userId}`);
    } catch (error) {
      console.error('Error claiming ticket:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchID(e.target.value)
  }

  const handleSearch = async (theId) => {
    const compTicketsQuery = query(
      collection(db, 'tickets'), 
      where('ticketNumber', '==', theId),
      where('companyId', '==', userCompId),
    );
    console.log(" user companyID:", userCompId)

    onSnapshot(compTicketsQuery, (querySnapshot) => {
      const compTicketsArray = [];
      querySnapshot.forEach((doc) => {
        compTicketsArray.push({ id: doc.id, ...doc.data() });
      });
      setCompTickets(compTicketsArray);
    });
  }
  
  const myTickets = tickets.filter(ticket => ticket.claimed === userId && ticket.status !== 'closed');
  const unclaimedTickets = tickets.filter(ticket => ticket.claimed === "" && ticket.status !== 'closed');
  const closedTickets = tickets.filter(ticket => ticket.status === 'closed');

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Support C Dashboard</h1>
      <div className="tickets-container">
        <div className="tabs">
            <button onClick={() => setActiveTab('claimed')} className={activeTab === 'claimed' ? 'active-tab' : ''}>
                Claimed Tickets
            </button>
            <button onClick={() => setActiveTab('unclaimed')} className={activeTab === 'unclaimed' ? 'active-tab' : ''}>
                Unclaimed Tickets
            </button>
            <button onClick={() => setActiveTab('closed')} className={activeTab === 'closed' ? 'active-tab' : ''}>
                Closed Tickets
            </button>
            <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'active-tab' : ''}>
                Search Tickets
            </button> 
        </div>

        {activeTab === 'claimed' && (
            <div className="claimed-tickets-container">
                <h2 className="tickets-header">My Tickets</h2>
                <Tickets
                    tickets={myTickets}
                    onTicketClick={handleTicketClick}
                    onCloseTicket={handleCloseTicket}
                    onAssignTicket={handleClaimTicket}
                    selectedTicket={selectedTicket}
                    role='support'
                    userId = {userId}
                />
            </div>
        )}
        {activeTab === 'unclaimed' && (
            <div className="unclaimed-tickets-container">
                <h2 className="tickets-header">Unclaimed Tickets</h2>
                <Tickets
                    tickets={unclaimedTickets}
                    onTicketClick={handleTicketClick}
                    onCloseTicket={handleCloseTicket}
                    onAssignTicket={handleClaimTicket}
                    selectedTicket={selectedTicket}
                    role='support'
                    userId = {userId}
                />
            </div>
        )}
        {activeTab === 'closed' && (
            <div className="closed-tickets-container">
                <h2 className="tickets-header">Closed Tickets</h2>
                <Tickets
                    tickets={closedTickets}
                    onTicketClick={handleTicketClick}
                    selectedTicket={selectedTicket}
                    role='support'
                    userId = {userId}
                    
                />
            </div>
        )}
        {activeTab === 'search' && (
            <div className="search-tickets-container">
                <h2 className="tickets-header">Search Tickets</h2>      {/* search function goes in here, make sure changes reflect in A/B/C (sorry...) */}
                <input className="search-control" placeholder="Ticket #" type="text" name="search" onChange={handleSearchChange}/>
                <button className='search-button' onClick={() => handleSearch(searchID)}>Search</button>
                <Tickets
                  tickets={compTickets}
                  role='support'
                  userId = {userId}
                  search = {true}
                  onTicketClick={handleTicketClick}
                  onCloseTicket={handleCloseTicket}
                  onAssignTicket={handleClaimTicket}
                />
            </div>
        )}
      
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
