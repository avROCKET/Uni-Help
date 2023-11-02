import { useState, useEffect } from 'react';
import { getFirestore, query, collection, where, orderBy, limit, getDocs } from 'firebase/firestore';

const db = getFirestore();

const useTicketGenerator = () => {
  const [ticketNumber, setTicketNumber] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const generateNewTicketNumber = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const ticketsQuery = query(
          collection(db, 'tickets'), //indexing the database
          where('year', '==', currentYear), // year acsending
          orderBy('ticketNumber', 'desc'), // ticket# descending
          limit(1)
        );
        const querySnapshot = await getDocs(ticketsQuery); //gets the laste ticket number
        let newTicketNumber;
        if (!querySnapshot.empty) { //take last and add 1. format: YYYY-########, starts at 00000001
          const lastTicketNumber = querySnapshot.docs[0].data().ticketNumber;
          newTicketNumber = `${currentYear}-${String(Number(lastTicketNumber.split('-')[1]) + 1).padStart(8, '0')}`;
        } else {
          newTicketNumber = `${currentYear}-00000001`; //if no ticket with ticket number, then start at 1
        }
        //IMPORTANT: page needs to be reloaded...
        setTicketNumber(newTicketNumber);
      } catch (error) {
        console.error('Error generating ticket number:', error);
        setError(error);
      }
    };

    generateNewTicketNumber();
  }, []);

  return { ticketNumber, error };
};

export default useTicketGenerator;
