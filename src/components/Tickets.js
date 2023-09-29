import React from 'react';

const Tickets = ({ tickets, onTicketClick, onAssignTicket, onCloseTicket, onHideTicket, selectedTicket }) => {
    const assignedTickets = tickets.filter(ticket => ticket.assignedTo);
    const unassignedTickets = tickets.filter(ticket => !ticket.assignedTo);

    return (
        <div>
            <h2>Your Tickets</h2>

            {/* Assigned Tickets */}
            <h3>Assigned Tickets</h3>
            <ul>
                {assignedTickets.map((ticket) => (
                    <li key={ticket.id} style={ticket.id === selectedTicket ? { backgroundColor: 'lightgray' } : {}}>
                        <span onClick={() => onTicketClick(ticket.id)} style={{ cursor: "pointer" }}>
                            {ticket.subject} - {ticket.status} (Assigned to: {ticket.assignedTo})
                        </span>
                        {onAssignTicket && <button onClick={() => onAssignTicket(ticket.id)}>Re-Assign</button>}
                        {onCloseTicket && <button onClick={() => onCloseTicket(ticket.id)}>Close</button>}
                        {onHideTicket && <button onClick={() => onHideTicket(ticket.id)}>Hide</button>}
                    </li>
                ))}
            </ul>

            {/* Unassigned Tickets */}
            <h3>Unassigned Tickets</h3>
            <ul>
                {unassignedTickets.map((ticket) => (
                    <li key={ticket.id} style={ticket.id === selectedTicket ? { backgroundColor: 'lightgray' } : {}}>
                        <span onClick={() => onTicketClick(ticket.id)} style={{ cursor: "pointer" }}>
                            {ticket.subject} - {ticket.status}
                        </span>
                        {onAssignTicket && <button onClick={() => onAssignTicket(ticket.id)}>Assign</button>}
                        {onCloseTicket && <button onClick={() => onCloseTicket(ticket.id)}>Close</button>}
                        {onHideTicket && <button onClick={() => onHideTicket(ticket.id)}>Hide</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tickets;
