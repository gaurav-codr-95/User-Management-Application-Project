import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-modal";


const UserList = () => {
    const [users, setUsers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
      name: "",
      email: "",
      phone: "",
      address: { street: "", city: "" },
      company: { name: "" },
    });
    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [error, setError] = useState(null); // Error state
  
    useEffect(() => {
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
          setUsers(response.data);
          setError(null); // Reset error state on success
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setError("Failed to fetch users. Please try again."); // Set error message
        });
    }, []);
  
    
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      axios
        .put(
          `https://jsonplaceholder.typicode.com/users/${editingUser.id}`,
          newUser
        )
        .then((response) => {
          setUsers(
            users.map((user) =>
              user.id === editingUser.id ? response.data : user
            )
          );
          setModalIsOpen(false);
          setEditingUser(null);
          setError(null); // Reset error state on success
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          setError("Failed to update user. Please try again."); // Set error message
        });
    } else {
      axios
        .post("https://jsonplaceholder.typicode.com/users", newUser)
        .then((response) => {
          setUsers([...users, response.data]);
          setModalIsOpen(false);
          setError(null); // Reset error state on success
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          setError("Failed to create user. Please try again."); // Set error message
        });
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: { street: user.address.street, city: user.address.city },
      company: { name: user.company.name },
    });
    setModalIsOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      axios
        .delete(`https://jsonplaceholder.typicode.com/users/${userToDelete.id}`)
        .then(() => {
          setUsers(users.filter((user) => user.id !== userToDelete.id));
          setDeleteModalOpen(false);
          setUserToDelete(null);
          setError(null); // Reset error state on success
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          setError("Failed to delete user. Please try again."); // Set error message
        });
    }
  };

  return (
   
        <div className="container">
      <h1>User List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
      <button onClick={() => setModalIsOpen(true)}>Add New User</button>
      <table border="1" style={{ width: "100%", textAlign: "left", overflow-x:"auto"}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
              <Link to={`/user/${user.id}`} className="view-details-link">
                    View Details
                  </Link>
                <button onClick={() => openEditModal(user)}>Edit</button>
                <button onClick={() => openDeleteModal(user)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>{editingUser ? "Edit User" : "Create New User"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            required
          />

          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={newUser.phone}
            onChange={handleInputChange}
            required
          />

          <label>Street:</label>
          <input
            type="text"
            name="address.street"
            value={newUser.address.street}
            onChange={handleInputChange}
            required
          />

          <label>City:</label>
          <input
            type="text"
            name="address.city"
            value={newUser.address.city}
            onChange={handleInputChange}
            required
          />

          <label>Company Name:</label>
          <input
            type="text"
            name="company.name"
            value={newUser.company.name}
            onChange={handleInputChange}
          />

          <button type="submit">
            {editingUser ? "Update User" : "Create User"}
          </button>
        </form>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
      >
        <h2>Confirm Delete</h2>
        <p>
          Are you sure you want to delete{" "}
          {userToDelete ? userToDelete.name : "this user"}?
        </p>
        <button onClick={confirmDeleteUser}>Yes, Delete</button>
        <button onClick={() => setDeleteModalOpen(false)}>Cancel</button>
      </Modal>
    </div>
   
  );
};

export default UserList;
