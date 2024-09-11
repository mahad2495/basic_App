import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ItemList.css";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [editItem, setEditItem] = useState({ id: "", name: "", quantity: "" });
  const [deleteId, setDeleteId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

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
        setShowAddForm(false); // Hide form after adding item
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
        setShowUpdateForm(false); // Hide form after updating item
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
        setShowDeleteForm(false); // Hide form after deleting item
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="item-list-container">
      <h1>Item List</h1>
      
      <table className="item-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="button-section">
        <button onClick={() => setShowAddForm(!showAddForm)}>Add Item</button>
        <button onClick={() => setShowUpdateForm(!showUpdateForm)}>Update Item</button>
        <button onClick={() => setShowDeleteForm(!showDeleteForm)}>Delete Item</button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddItem} className="form-section">
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
      )}

      {showUpdateForm && (
        <form onSubmit={handleUpdateItem} className="form-section">
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
      )}

      {showDeleteForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDeleteItem();
          }}
          className="form-section"
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
      )}
    </div>
  );
};

export default ItemList;
