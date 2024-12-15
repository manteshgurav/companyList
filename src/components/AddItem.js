import React, { useState } from 'react';
import axios from 'axios';

const AddItem = ({ fetchItems }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null); // State for handling errors

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const data = { name, description }; // Prepare the payload

    try {
      await axios.post('http://localhost:5000/items', data); // Add the new item
      setName(''); // Clear the name input
      setDescription(''); // Clear the description input
      setError(null); // Reset any previous errors
      fetchItems(); // Fetch updated items list
    } catch (err) {
      console.error('Error adding item:', err.response?.data || err.message);
      setError('Failed to add item. Please try again.'); // Set an error message
    }
  };

  return (
    <div>
      <h2>Add Item</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update name state
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Update description state
          placeholder="Description"
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddItem;
