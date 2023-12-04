import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../utils/AuthContext.js'; 
import { getCompanyEmployees } from '../utils/dataFunctions.js'; 
import { register } from '../utils/authFunctions.js'; 

function CompanyDashboard() {
  const { user, userData } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (user) {
      getCompanyEmployees(user.uid).then(setEmployees).catch(console.error);
    }
  }, [user]);
  const [formState, setFormState] = useState({ email: '', password: '', name: '', role: 'supporta' });
  
  if (!userData || userData.role !== 'company') {
    return <div>Access denied</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    try {
      await register(formState.email, formState.password, formState.name, formState.role, true, userData.uid); //set auto-login to true, due to invalid permissions error.
      alert('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };
  

  return (
    <div className='dashboard-container'>
      <h1>Company Dashboard</h1>
      <p>Company ID: {userData.uid}</p>
      <form onSubmit={handleSubmit}>
        <input className='form-control'
          type="text" 
          name="name" 
          placeholder="Name" 
          value={formState.name} 
          onChange={handleInputChange} 
        />
        <input className='form-control'
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formState.email} 
          onChange={handleInputChange} 
        />
        <input className='form-control'
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formState.password} 
          onChange={handleInputChange} 
        />
        <select className='form-control-review'
          name="role" 
          value={formState.role} 
          onChange={handleInputChange}
        >
          <option value="supporta">Support Level 1</option>
          <option value="supportb">Support Level 2</option>
          <option value="supportc">Support Level 3</option>
          <option value="reviewer">Reviewer</option>
        </select>
        <button className='material-button' type="submit">Create Employee Profile</button>
      </form>
      <h2>Employee List</h2>
    <ul>
      {employees.map(employee => (
        <li key={employee.id}>{employee.name} ({employee.role})</li>
      ))}
    </ul>
    </div>
  );
}

export default CompanyDashboard;
