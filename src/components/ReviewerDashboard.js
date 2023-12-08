import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, deleteDoc, getFirestore, collection, query, where, getDoc, onSnapshot, orderBy } from 'firebase/firestore';
import Tickets from './Tickets';
import ChatModal from './ChatModal';


const db = getFirestore();

const ReviewerDashboard = () => {  
  const [tickets, setTickets] = useState([]);
  const [selectedSupportLevel, setSelectedSupportLevel] = useState('SupportA');
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [role, setRole] = useState(null);
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  // eslint-disable-next-line
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('all')
  const [compTickets, setCompTickets] = useState([]);
  const [searchID, setSearchID] = useState(null);
  const [userCompId, setUserCompId] = useState(null);




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
          setRole(userData.role);
          setUserCompId(userData.companyId);

          const ticketsQuery = query(collection(db, 'tickets'), where('companyId', '==', userCompId));
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
      await updateDoc(ticketRef, { assignedTo: selectedSupportLevel, claimed: ''});
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  const handleTicketClick = (ticketId) => {

    const selectedTicketDetails = tickets.find(ticket => ticket.id === ticketId); //UPDATE: this gets all ticket messages, ordered by timestamp.
    setSelectedTicketData(selectedTicketDetails);
    const messagesQuery = query(
      collection(doc(db, 'tickets', ticketId), 'messages'), 
      orderBy('timestamp', 'desc') 
    );

    onSnapshot(messagesQuery, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            messages.push(doc.data());
        });
        
        setActiveChatMessages(messages);
        console.log("Fetched messages:", messages);
    });
    setModalOpen(true);
};

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

const handleSearchChange = (e) => {
  setSearchID(e.target.value)
}

const handleTicketDelete = async (ticketId) => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketSnapshot = await getDoc(ticketRef);

    if (ticketSnapshot.exists()) {
      const ticketData = ticketSnapshot.data();

      // this will check if the tickets are assigned. 
      if (!ticketData.assignedTo || ticketData.assignedTo === '') {
        await deleteDoc(ticketRef);
        console.log('Ticket deleted successfully');
      } else {
        console.log('Error.');
      }
    } else {
      console.log('Ticket not found');
    }
  } catch (error) {
    console.error('Error deleting ticket:', error);
  }
};

  return (
    <div className="dashboard-container">
      <h1>Reviewer Dashboard</h1>
      <div className="tabs">
            <button onClick={() => setActiveTab('all')} className={activeTab === 'all' ? 'active-tab' : ''}>
                All Tickets
            </button>
            <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'active-tab' : ''}>
                Search Tickets
            </button>
      </div>
      <select className="form-control-review" value={selectedSupportLevel} onChange={e => setSelectedSupportLevel(e.target.value)}>
        <option value="SupportA">Support A</option>
        <option value="SupportB">Support B</option>
        <option value="SupportC">Support C</option>
        <option value="">Remove Assignment</option>
      </select>
      {activeTab === 'all' && (
      <Tickets
          tickets={tickets}
          onTicketClick={handleTicketClick}
          onAssignTicket={handleAssignTicket}
          onTicketDelete={handleTicketDelete}
          role={role}
      />
      )}
      {activeTab === 'search' && (
      <div className="search-tickets-container">
        <h2 className="tickets-header">Search Tickets</h2>      {/* search function goes in here, make sure changes reflect in A/B/C (sorry...) */}
          <input className="search-control" placeholder="Ticket #" type="text" name="search" onChange={handleSearchChange}/>
          <button className='search-button' onClick={() => handleSearch(searchID)}>Search</button>
        <Tickets
          tickets={compTickets}
          role='support'
          onTicketClick={handleTicketClick}
          onAssignTicket={handleAssignTicket}
          onTicketDelete={handleTicketDelete}
          userId = {userId}
          search = {true}
        />
        </div>
      )}

      <ChatModal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        messages={activeChatMessages}
        canSendMessage={false} 
        selectedTicketData={selectedTicketData} //pass ticket data as props
        isClosed={selectedTicketData?.status === 'closed'} // this prevents further messages to be sent if the ticket is closed.
        userId={userId} //pass userID so user name is shown with their message (see ChatModal)
      />
    </div>
  );
};

//mesages sucessfully link with support and user

export default ReviewerDashboard;
