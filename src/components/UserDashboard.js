import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, addDoc, getFirestore, collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import Tickets from './Tickets';
import ChatModal from './ChatModal';
import useTicketGenerator from '../utils/useTicketGenerator';

const db = getFirestore();

const UserDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [userId, setUserId] = useState(null);
  const [formState, setFormState] = useState({ companyId: '', subject: '', description: '' });  
  const [tickets, setTickets] = useState([]);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { ticketNumber, error } = useTicketGenerator()  


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

    const selectedTicketDetails = tickets.find(ticket => ticket.id === ticketId); //UPDATE: this gets all ticket data
    setSelectedTicketData(selectedTicketDetails);

    const messagesQuery = query(collection(doc(db, 'tickets', ticketId), 'messages'), orderBy('timestamp', 'desc')); //fetches messages
    
    onSnapshot(messagesQuery, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            messages.push(doc.data());
        });
        setActiveChatMessages(messages);
        setSelectedTicket(ticketId);
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

  // validates that the form is filled before submission
  const validateForm = () => {
    const errors = {};

    if (!formState.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formState.description.trim()) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;  
  };

  useEffect(() => { // if ticket generator fails for some reason, log in console
    if (error) {
      console.error('Error message: ', error); 
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;  // Prevent form submission if validation fails

    try {
      if (!ticketNumber) throw new Error('Ticket number not generated yet.');
      const ticketData = {
        userId: userId,
        companyId: formState.companyId,
        subject: formState.subject,
        description: formState.description,
        status: 'open',
        created: new Date(),
        isVisible: true,
        ticketNumber: ticketNumber,
        year: new Date().getFullYear(),
      };
  
      console.log("ticketData before sending:", ticketData);
      await addDoc(collection(db, 'tickets'), ticketData);
      
      alert('Ticket submitted successfully');
      setFormState({ companyId: '', subject: '', description: '' }); //this resets the form field upon submissioon
      setFormErrors({});
      window.location.reload(); // inconvenient but this is the only way i was able to fix the ticketgenerator.
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Error submitting ticket. Please fill out necessary fields.');
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
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>
      <div className="dashboard-content">
        <form className="ticket-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Company</label>
            <select className="form-control" name="companyId" value={formState.companyId} onChange={handleInputChange}>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input className="form-control" type="text" name="subject" value={formState.subject} onChange={handleInputChange} />
            {formErrors.subject && <div className="error-message">{formErrors.subject}</div>}  
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" name="description" value={formState.description} onChange={handleInputChange} />
            {formErrors.description && <div className="error-message">{formErrors.description}</div>}
          </div>
          
          <button className="material-button" type="submit">Submit Ticket</button>
        </form>
        
        <Tickets
          tickets={tickets}
          onTicketClick={handleTicketClick}
          onCloseTicket={handleCloseTicket} //if close, show open
          onHideTicket={handleHideTicket}
          selectedTicket={selectedTicket}
          role='user'
        />
      </div>
      
      <ChatModal // using chatmodal for users and support. reviewers can only view chats so they will use regual modal screen, which i will update later 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        messages={activeChatMessages}
        canSendMessage={true} 
        onSendMessage={sendMessageToTicket}
        selectedTicketData={selectedTicketData} //pass ticket data as props
        isClosed={selectedTicketData?.status === 'closed'} // this prevents further messages to be sent if the ticket is closed.
        userId={userId} //pass userID so user name is shown with their message (see ChatModal)
      />
    </div>
  );
}

export default UserDashboard;
