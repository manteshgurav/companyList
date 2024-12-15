import React, { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import AddItem from './components/AddItem';
import EditItem from './components/EditItem';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch items when the component mounts
  useEffect(() => {
    
    fetchItems();
  }, []); // Run only once when the component is mounted


  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  return (
    <div className="App">
      <h1>CRUD App</h1>
      {editingItem ? (
        <EditItem
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          setItems={setItems}
        />
      ) : (
        <AddItem setItems={setItems} fetchItems={fetchItems} />
      )}
      <ItemList items={items} setEditingItem={setEditingItem} setItems={setItems} />
    </div>
  );
}

export default App;
