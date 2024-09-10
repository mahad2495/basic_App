
import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [editItem, setEditItem] = useState({ id: "", name: "", quantity: "" });
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    // Fetch items
    axios
      .get("http://localhost:5000/api/get")
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Handle adding a new item
  const handleAddItem = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/add", newItem)
      .then((response) => {
        setItems([...items, response.data]);
        setNewItem({ name: "", quantity: "" });
      })
      .catch((error) => console.error(error));
  };

  // Handle updating an item
  const handleUpdateItem = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/update/${editItem.id}`, {
        name: editItem.name,
        quantity: editItem.quantity,
      })
      .then((response) => {
        const updatedItems = items.map((item) =>
          item._id === editItem.id ? response.data : item
        );
        setItems(updatedItems);
        setEditItem({ id: "", name: "", quantity: "" });
      })
      .catch((error) => console.error(error));
  };

  // Handle deleting an item
  const handleDeleteItem = () => {
    axios
      .delete(`http://localhost:5000/api/delete/${deleteId}`)
      .then(() => {
        const filteredItems = items.filter((item) => item._id !== deleteId);
        setItems(filteredItems);
        setDeleteId("");
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Item List</h1>
      <ol>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} : {item.quantity}
          </li>
        ))}
      </ol>

      <form onSubmit={handleAddItem}>
        <h2>Add Item</h2>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          required
        />
        <button type="submit">Add Item</button>
      </form>

      <form onSubmit={handleUpdateItem}>
        <h2>Update Item</h2>
        <input
          type="text"
          placeholder="Item ID"
          value={editItem.id}
          onChange={(e) => setEditItem({ ...editItem, id: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="New Name"
          value={editItem.name}
          onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="New Quantity"
          value={editItem.quantity}
          onChange={(e) =>
            setEditItem({ ...editItem, quantity: e.target.value })
          }
          required
        />
        <button type="submit">Update Item</button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDeleteItem();
        }}
      >
        <h2>Delete Item</h2>
        <input
          type="text"
          placeholder="Item ID"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
          required
        />
        <button type="submit">Delete Item</button>
      </form>
    </div>
  );
};

export default ItemList;
