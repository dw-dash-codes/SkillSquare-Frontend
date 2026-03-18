import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAllProviders, updateProviderStatus} from "../../services/api"; 

const GetAllProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const data = await getAllProviders();
      setProviders(data);
    } catch (error) {
      console.error("Error loading providers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Active Status
  const handleStatusChange = async (id, newStatus) => {
    const action = newStatus ? "Approve" : "Suspend";
    if (!window.confirm(`Are you sure you want to ${action} this provider?`)) return;

    try {
      await updateProviderStatus(id, newStatus);
      // Update UI locally
      setProviders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p))
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  // Handle Delete (Reject)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to REJECT and DELETE this provider? This cannot be undone.")) return;

    try {
      await deleteProvider(id);
      setProviders((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Failed to delete provider");
    }
  };

  if (loading) return <div className="p-4">Loading providers...</div>;

  return (
    <>
      <div className="">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Manage Providers</h1>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h3 className="card-title">Service Providers List</h3>
              </div>
              <div className="card-body p-0 table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th style={{width: "50px"}}>Avatar</th>
                      <th>Name & Contact</th>
                      <th>Category</th>
                      <th>City</th>
                      <th>Rate</th>
                      <th>Status</th>
                      <th style={{minWidth: "180px"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.length === 0 ? (
                      <tr><td colSpan="7" className="text-center p-3">No providers found.</td></tr>
                    ) : (
                      providers.map((p) => (
                        <tr key={p.id}>
                           {/* Avatar Initials */}
                          <td className="text-center align-middle">
                            <div className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center mx-auto" style={{width:"35px", height:"35px"}}>
                                {p.fullName.charAt(0).toUpperCase()}
                            </div>
                          </td>
                          
                          <td>
                            <strong>{p.fullName}</strong>
                            <br/>
                            <small className="text-muted">{p.email}</small>
                          </td>
                          
                          <td className="align-middle">
                            <span className="badge bg-info text-dark">{p.categoryName}</span>
                          </td>
                          
                          <td className="align-middle">{p.city || "N/A"}</td>
                          
                          <td className="align-middle">${p.hourlyRate}/hr</td>
                          
                          <td className="align-middle">
                            {p.isActive ? (
                                <span className="badge bg-success">Active</span>
                            ) : (
                                <span className="badge bg-warning text-dark">Pending / Suspended</span>
                            )}
                          </td>
                          
                          <td className="align-middle">
                            {/* Actions based on Status */}
                            {!p.isActive ? (
                                <>
                                    <button 
                                        onClick={() => handleStatusChange(p.id, true)} 
                                        className="btn btn-sm btn-success me-2"
                                        title="Approve / Activate"
                                    >
                                        <i className="fas fa-check"></i> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(p.id)} 
                                        className="btn btn-sm btn-danger"
                                        title="Reject / Delete"
                                    >
                                        <i className="fas fa-times"></i> Reject
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Link to details page if you have one */}
                                    <NavLink 
                                        to={`/admin/providerProfile/${p.id}`} 
                                        className="btn btn-sm btn-info me-2 text-white"
                                        title="View Details"
                                    >
                                        <i className="fas fa-eye"></i>
                                    </NavLink>
                                    
                                    <button 
                                        onClick={() => handleStatusChange(p.id, false)} 
                                        className="btn btn-sm btn-warning text-dark"
                                        title="Suspend / Deactivate"
                                    >
                                        <i className="fas fa-ban"></i> Suspend
                                    </button>
                                </>
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

export default GetAllProviders;