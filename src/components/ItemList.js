import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemList = ({ setEditingItem }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(null); // To manage error state

  useEffect(() => {
    fetchItems();
  }, []); // Fetch items when the component mounts

  // Fetch items from the server
  const fetchItems = async () => {
    setLoading(true); // Set loading to true when fetching
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data);
      setError(null); // Reset error state
    } catch (err) {
      console.error('Error fetching items:', err.message);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  // Handle item deletion
  const handleDelete = async (id) => {
    setLoading(true); // Set loading to true when deleting
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      fetchItems(); // Fetch updated items after deletion
    } catch (err) {
      console.error('Error deleting item:', err.message);
      setError('Failed to delete item. Please try again.');
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  return (
    <div>
      <h2>Items</h2>

      {loading && <p>Loading...</p>} {/* Show loading message */}

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

      <ul>
        {items.length === 0 && !loading && <p>No items available.</p>} {/* Show message when no items */}

        {items.map((item) => (
          <li key={item._id}>
            <strong>{item.name}</strong>: {item.description}
            <button onClick={() => setEditingItem(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
