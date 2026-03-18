import React, { useEffect, useState } from "react";
import { getAllCustomers, updateUserStatus } from "../../services/api"; 

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Users on Load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllCustomers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Block/Unblock
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = !currentStatus; // Toggle status
    const action = newStatus ? "ACTIVATE" : "BLOCK";
    
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await updateUserStatus(id, newStatus);
      
      // Update UI locally without refreshing
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: newStatus } : u))
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <>
      <div className="">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Manage Users</h1>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h3 className="card-title">System Users (Customers)</h3>
              </div>
              <div className="card-body p-0 table-responsive">
                <table
                  id="usersTable"
                  className="table table-striped table-hover"
                >
                  <thead>
                    <tr>
                      <th style={{width: "50px"}}>Avatar</th>
                      <th>Name & Email</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th style={{width: "120px"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan="7" className="text-center p-3">No customers found.</td></tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          {/* Avatar */}
                          <td className="text-center align-middle">
                            <div className="bg-light rounded-circle border d-flex align-items-center justify-content-center mx-auto" style={{width:"35px", height:"35px"}}>
                                <span className="fw-bold text-secondary">{user.fullName.charAt(0).toUpperCase()}</span>
                            </div>
                          </td>

                          {/* Name/Email */}
                          <td className="align-middle">
                            <strong>{user.fullName}</strong>
                            <br/>
                            <small className="text-muted">{user.email}</small>
                          </td>

                          {/* Phone */}
                          <td className="align-middle">{user.phoneNumber || "N/A"}</td>

                          {/* City */}
                          <td className="align-middle">{user.city || "N/A"}</td>

                          {/* Role */}
                          <td className="align-middle">
                             <span className="badge bg-primary">Customer</span>
                          </td>

                          {/* Status Badge */}
                          <td className="align-middle">
                            {user.isActive ? (
                                <span className="badge bg-success">Active</span>
                            ) : (
                                <span className="badge bg-danger">Blocked</span>
                            )}
                          </td>

                          {/* Actions (Block/Unblock) */}
                          <td className="align-middle">
                            {user.isActive ? (
                                <button 
                                    onClick={() => handleStatusChange(user.id, user.isActive)}
                                    className="btn btn-sm btn-outline-danger w-100"
                                    title="Block User"
                                >
                                    <i className="fas fa-ban me-1"></i> Block
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleStatusChange(user.id, user.isActive)}
                                    className="btn btn-sm btn-success w-100"
                                    title="Unblock User"
                                >
                                    <i className="fas fa-unlock me-1"></i> Unblock
                                </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetAllUsers;