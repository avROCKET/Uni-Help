import React from 'react';

const Tickets = ({ tickets, onTicketClick, onCloseTicket, onHideTicket, selectedTicket }) => {
    return (
      <div>
        <h2>Your Tickets</h2>
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id} style={ticket.id === selectedTicket ? { backgroundColor: 'lightgray' } : {}}>
              <span onClick={() => onTicketClick(ticket.id)} style={{cursor: "pointer"}}>
                {ticket.subject} - {ticket.status}
              </span>
              {onCloseTicket && <button onClick={() => onCloseTicket(ticket.id)}>Close</button>}
              {onHideTicket && <button onClick={() => onHideTicket(ticket.id)}>Hide</button>}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  

export default Tickets;
