import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ModalAlert from "../components/ModalAlert";

const Booking = () => {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    bookingDate: "",
    bookingTime: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    description: "",
  });

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setLoading(true);

        const [providerRes, ratingRes, categoryRes] = await Promise.all([
          api.get(`/Provider/${id}`),
          api.get(`/Review/average/${id}`),
          api.get("/ServiceCategory"),
        ]);

        setProvider(providerRes.data);
        setRating(ratingRes.data);
        setCategory(categoryRes.data);
      } catch (err) {
        console.log("Error loading provider data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [id]);

  const categoryName = category.find((c) => c.id === provider?.categoryId)?.title;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "P";
    const f = firstName ? firstName[0] : "";
    const l = lastName ? lastName[0] : "";
    return (f + l).toUpperCase() || "P";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const bookingData = {
        providerId: id,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        description: formData.description,
      };

      await api.post("/Booking", bookingData);

      setAlert({
        type: "success",
        title: "Booking Confirmed",
        message: "Your booking is confirmed. Please click below to check your bookings.",
        actions: [
          { label: "See Bookings", path: "/my-bookings" },
          { label: "Home", path: "/" },
        ],
      });
    } catch (err) {
      console.error("Error creating booking:", err);
      setAlert({
        type: "error",
        title: "Booking Failed",
        message: "Failed to create booking. Please try again.",
        actions: [{ label: "Try Again" }],
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="app-section bg-light min-vh-100 py-5" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-7">
              
              <div className="text-center mb-4">
                <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-secondary font-body small p-0 hover-primary mb-3">
                  <i className="fas fa-arrow-left me-2"></i> Back
                </button>
                <h1 className="font-display fw-bold text-dark mb-2">Book Your Service</h1>
                <p className="text-secondary font-body mb-0">Confirm details and send your request.</p>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status"></div>
                  <p className="mb-0 text-secondary font-body">Loading provider info...</p>
                </div>
              ) : provider ? (
                <div className="card app-card border-0 rounded-4 shadow-lg bg-white overflow-hidden">
                  
                  {/* Compact Provider Header Inside the Form */}
                  <div className="p-4" style={{ background: 'var(--app-surface-muted)', borderBottom: '1px solid var(--app-border)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center text-white font-display fw-bold" 
                        style={{ width: '60px', height: '60px', fontSize: '1.5rem', background: 'var(--gradient-warm)' }}
                      >
                        {getInitials(provider.firstName, provider.lastName)}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="font-display fw-bold mb-1 text-dark">
                          {provider.firstName} {provider.lastName}
                        </h5>
                        <p className="text-secondary font-body small mb-0">
                          {categoryName || "Service Provider"}
                        </p>
                      </div>
                      <div className="text-end d-none d-sm-block">
                        <div className="font-body fw-bold" style={{ color: 'var(--app-primary)' }}>
                          ${provider.hourlyRate}/hour
                        </div>
                        <div className="text-secondary font-body small">
                          <i className="fas fa-star text-warning me-1"></i>
                          {rating.averageRating.toFixed(1)} ({rating.totalReviews})
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Area */}
                  <div className="p-4 p-md-5">
                    <form id="bookingForm" onSubmit={handleSubmit} className="font-body">
                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label htmlFor="bookingDate" className="form-label fw-bold text-dark small mb-1">Select Date</label>
                          <input
                            type="date"
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            id="bookingDate"
                            value={formData.bookingDate}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="col-sm-6">
                          <label htmlFor="bookingTime" className="form-label fw-bold text-dark small mb-1">Select Time</label>
                          <select
                            className="form-select px-3 py-2 bg-light border-0 shadow-none text-dark"
                            style={{ borderRadius: '0.75rem' }}
                            id="bookingTime"
                            value={formData.bookingTime}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Choose time</option>
                            <option value="08:00">08:00 AM</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="13:00">01:00 PM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                            <option value="17:00">05:00 PM</option>
                            <option value="18:00">06:00 PM</option>
                          </select>
                        </div>

                        <div className="col-sm-6 mt-4">
                          <label htmlFor="customerName" className="form-label fw-bold text-dark small mb-1">Your Full Name</label>
                          <input
                            type="text"
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            id="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                          />
                        </div>

                        <div className="col-sm-6 mt-4">
                          <label htmlFor="customerPhone" className="form-label fw-bold text-dark small mb-1">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            id="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label htmlFor="customerAddress" className="form-label fw-bold text-dark small mb-1">Service Address</label>
                          <input
                            type="text"
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            id="customerAddress"
                            value={formData.customerAddress}
                            onChange={handleChange}
                            placeholder="Where do you need the service?"
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label htmlFor="description" className="form-label fw-bold text-dark small mb-1">Requirements / Description</label>
                          <textarea
                            className="form-control px-3 py-3 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            id="description"
                            rows="4"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what needs to be done..."
                          ></textarea>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-gradient-warm w-100 rounded-pill py-3 fw-bold mt-5 shadow-warm"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <><i className="fas fa-spinner fa-spin me-2"></i>Confirming Booking...</>
                        ) : (
                          <><i className="fas fa-check-circle me-2"></i>Confirm Booking</>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="card app-card border-0 text-center p-5 rounded-4 shadow-sm">
                  <h4 className="font-display fw-bold mb-2">Provider not found</h4>
                  <p className="text-secondary font-body mb-0">We couldn’t load the provider information right now.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {alert && <ModalAlert {...alert} onClose={() => setAlert(null)} />}
    </>
  );
};

export default Booking;