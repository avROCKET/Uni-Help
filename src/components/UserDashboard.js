import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, addDoc, getFirestore, collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import Tickets from './Tickets';
import ChatModal from './ChatModal';

const db = getFirestore();

const UserDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [userId, setUserId] = useState(null);
  const [formState, setFormState] = useState({ companyId: '', subject: '', description: '' });  
  const [tickets, setTickets] = useState([]);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);


  const fetchTicketsAndListenForUpdates = () => {
    if (userId) {
      const ticketsQuery = query(collection(db, 'tickets'), where('userId', '==', userId), where('isVisible', '==', true));
      onSnapshot(ticketsQuery, (querySnapshot) => {
        const ticketsArray = [];
        querySnapshot.forEach((doc) => {
          ticketsArray.push({ id: doc.id, ...doc.data() });
        });
        setTickets(ticketsArray);
      });
    }
  }; 
  
  useEffect(() => {
    fetchTicketsAndListenForUpdates();
  }, [userId]);

  const handleTicketClick = (ticketId) => {
  setModalOpen(true);
  
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

useEffect(() => {
  console.log("selectedTicket changed:", selectedTicket);
}, [selectedTicket]);

  const fetchCompanies = async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'company'));
      const querySnapshot = await getDocs(q);
      const companiesArray = [];
      querySnapshot.forEach((doc) => {
        companiesArray.push({ id: doc.id, ...doc.data() });
      });
      setCompanies(companiesArray);
        if (companiesArray.length > 0) {
      setFormState(prevState => ({ ...prevState, companyId: companiesArray[0].id }));
}
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
    
    return () => unsubscribe();
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    console.log("Setting form state:", name, value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const ticketData = {
        userId: userId,
        companyId: formState.companyId,
        subject: formState.subject,
        description: formState.description,
        status: 'open',
        created: new Date(),
        isVisible: true,
      };
  
      console.log("ticketData before sending:", ticketData);
      const ticketRef = await addDoc(collection(db, 'tickets'), ticketData);
      
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
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };
  
  const handleHideTicket = async (ticketId) => {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { isVisible: false });
    } catch (error) {
      console.error('Error hiding ticket:', error);
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
    <div>
      <h1>User Dashboard</h1>
      <form onSubmit={handleSubmit}>
      <label>
        Company
        <select name="companyId" value={formState.companyId} onChange={handleInputChange}>
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
      <Tickets
        tickets={tickets}
        onTicketClick={handleTicketClick}
        onCloseTicket={handleCloseTicket} //if close, show open
        onHideTicket={handleHideTicket}
        selectedTicket={selectedTicket}
      />
      
      <ChatModal // using chatmodal for users and support. reviewers can only view chats so they will use regual modal screen, which i will update later 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        messages={activeChatMessages}
        canSendMessage={true} 
        onSendMessage={sendMessageToTicket}
      />
    </div>
  );
}

export default UserDashboard;
