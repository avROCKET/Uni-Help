import React from 'react';


const Tickets = ({ tickets, onTicketClick, onAssignTicket, onCloseTicket, onTicketDelete, onHideTicket, onEscalateTicket, selectedTicket, role, userId }) => {
    const assignedTickets = tickets.filter(ticket => ticket.assignedTo);
    const unassignedTickets = tickets.filter(ticket => !ticket.assignedTo);
    

    
    const renderTickets = (ticketsList, assigned, user, support) => (
        <table className="ticket-table">
            <thead>
                <tr>
                    <th>Ticket Number</th>
                    <th>Subject</th>
                    <th>Status</th>
                    {!support && <th>Support Level</th>}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {ticketsList.map((ticket) => (
                    <tr className={`ticket-row ${ticket.id === selectedTicket ? 'selected-ticket' : ''}`} key={ticket.id}>
                        <td onClick={() => onTicketClick(ticket.id)}><b>{ticket.ticketNumber}</b></td>
                        <td onClick={() => onTicketClick(ticket.id)}>{ticket.subject}</td>
                        <td onClick={() => onTicketClick(ticket.id)}>{ticket.status}</td>
                        {<td onClick={() => onTicketClick(ticket.id)}>{user && ticket.assignedTo}</td>}
                        
                        <td>
                            {ticket.status !== 'closed' && onCloseTicket && <button className="ticket-button" onClick={() => onCloseTicket(ticket.id)}>&nbsp;Close</button>}
                            {onHideTicket && <button className="ticket-button" onClick={() => onHideTicket(ticket.id)}>Delete</button>}
                            {!assigned && onTicketDelete && <button className="ticket-button" onClick={() => onTicketDelete(ticket.id)}>Delete</button>}
                            {onEscalateTicket && <button className="ticket-button" onClick={() => onEscalateTicket(ticket.id)}>Escalate</button>}
                            {!ticket.claimed && role === 'support' && ticket.status !== 'closed' && (<button className="ticket-button" onClick={() => onAssignTicket(ticket.id)}>Claim</button>)}
                            {role !== 'support' && onAssignTicket && (<button className="ticket-button" onClick={() => onAssignTicket(ticket.id)}>{assigned ? 'Re-Assign' : 'Assign'}</button>)}
                        </td>
                    </tr>

                ))}
            </tbody>
        </table>
    );
    

    if (role === 'reviewer') {
        return (
            <div className="ticket-container">
                <h2 className="ticket-header">Your Tickets</h2>
                <h3>Assigned Tickets</h3>
                {renderTickets(assignedTickets, true, true, false)}
                <h3>Unassigned Tickets</h3>
                {renderTickets(unassignedTickets, false, true, false)}
            </div>
        );
    } 
    
    else if (role === 'user') {
        return (
            <div className="ticket-container">
                <h2 className="ticket-header">My Inquiries</h2>
                {renderTickets(tickets, false, true, false )}
            </div>
        );
    } 
    
    else if (role === 'support') {
        return (
            <div className="ticket-container">
                {renderTickets(tickets)}
            </div>
        );
    } 
    
    else {
        return (
            <div className="ticket-container">
                <h2 className="ticket-header">Error.</h2>
            </div>
        );
    }
};

export default Tickets;
