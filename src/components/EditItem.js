// src/components/EditItem.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditItem = ({ editingItem, setEditingItem, setItems }) => {
  const [name, setName] = useState(editingItem.name);
  const [description, setDescription] = useState(editingItem.description);

  useEffect(() => {
    setName(editingItem.name);
    setDescription(editingItem.description);
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/items/${editingItem._id}`, { name, description })
      .then(response => {
        setItems(prevItems => prevItems.map(item => item._id === editingItem._id ? response.data : item));
        setEditingItem(null);
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Edit Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button type="submit">Update</button>
        <button type="button" onClick={() => setEditingItem(null)}>Cancel</button>
      </form>
    </div>
  );
};

export default EditItem;
