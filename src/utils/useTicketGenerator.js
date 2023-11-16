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
          where('year', '==', currentYear), // this is where the ticket will start a new incrementation if the year is a new year, like 2024, if there are no tickets from the new year
          orderBy('ticketNumber', 'desc'), // ticket# descending
          limit(1) //fetch the last ticket created, only a single doc should be returned
        );
        const querySnapshot = await getDocs(ticketsQuery); //gets the last ticket number
        let newTicketNumber;
        if (!querySnapshot.empty) { //take last and add 1. format: YYYY-########, starts at 00000001
          const lastTicketNumber = querySnapshot.docs[0].data().ticketNumber;
          newTicketNumber = `${currentYear}-${String(Number(lastTicketNumber.split('-')[1]) + 1).padStart(8, '0')}`; //*KNOWN BUG, Must Document.*
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

//BUGS: if ticket reaches YYYY-99999999, the ticket will increment to YYYY-100000000, but because of padding issues (exceeds 8 digits, so it will not increment properly). Realistically
//may not be an issue. However, it still needs error handling, at least.
export default useTicketGenerator;
