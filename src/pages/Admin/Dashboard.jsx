import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getDashboardStats } from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    pendingReviews: 0,
    recentProviders: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: "80vh"}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div className="container-fluid">
            <h1 className="m-0">Admin Dashboard</h1>
          </div>
        </div>

        <div className="dashboard">
          <div className="container-fluid">
            
            {/* --- Stats Boxes Row --- */}
            <div className="row">
              {/* Box 1: Users */}
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>{stats.totalUsers}</h3>
                    <p>Active Customers</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <NavLink to="/admin/getAllUsers" className="small-box-footer">
                    Manage Users <i className="fas fa-arrow-circle-right"></i>
                  </NavLink>
                </div>
              </div>

              {/* Box 2: Providers */}
              <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>{stats.totalProviders}</h3>
                    <p>Service Providers</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <NavLink to="/admin/getAllProviders" className="small-box-footer">
                    Manage Providers <i className="fas fa-arrow-circle-right"></i>
                  </NavLink>
                </div>
              </div>

              {/* Box 3: Bookings */}
              <div className="col-lg-3 col-6">
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>{stats.totalBookings}</h3>
                    <p>Total Bookings</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <NavLink to="/admin/getAllBookings" className="small-box-footer">
                    View Bookings <i className="fas fa-arrow-circle-right"></i>
                  </NavLink>
                </div>
              </div>

              {/* Box 4: Reviews */}
              <div className="col-lg-3 col-6">
                <div className="small-box bg-danger">
                  <div className="inner">
                    <h3>{stats.pendingReviews}</h3>
                    <p>Total Reviews</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <NavLink to="/admin/getAllReviews" className="small-box-footer">
                    Moderate Reviews <i className="fas fa-arrow-circle-right"></i>
                  </NavLink>
                </div>
              </div>
            </div>

            {/* --- Recent Providers List (Full Width since chart is gone) --- */}
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Recently Joined Providers</h3>
                  </div>
                  <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                      {stats.recentProviders.length === 0 ? (
                          <li className="list-group-item">No providers found.</li>
                        ) : (
                          stats.recentProviders.map((provider) => (
                            <li key={provider.id} className="list-group-item d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center">
      <div 
        className="bg-secondary rounded-circle d-flex justify-content-center align-items-center me-3" 
        style={{width: "40px", height: "40px", color: "white"}}
      >
        {provider.fullName.charAt(0).toUpperCase()} 
      </div>
      <div>
        {/* UPDATE: Use provider.fullName */}
        <h6 className="mb-0">{provider.fullName}</h6> 
        <small className="text-muted">
          {provider.city} 
          {provider.hourlyRate ? ` • $${provider.hourlyRate}/hr` : ""}
        </small>
      </div>
    </div>
    
    {/* UPDATE: Use provider.categoryName directly */}
    <span className="badge bg-primary rounded-pill">
        {provider.categoryName}
    </span>
  </li>
                        ))
                      )}
                    </ul>
                  </div>
                  <div className="card-footer text-center">
                    <NavLink to="/admin/getAllProviders" className="text-decoration-none">View All Providers</NavLink>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;