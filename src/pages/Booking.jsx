import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ModalAlert from "../components/ModalAlert";

const Booking = () => {
  const [alert, setAlert] = useState(null);

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
        title: "Booked",
        message:
          "Your booking is confirmed. Please click below to check your bookings.",
        actions: [
          {
            label: "See Bookings",
            path: "/my-bookings",
          },
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
      <section className="app-section app-section-hero booking-page">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
              Booking
            </span>

            <h1 className="app-section-title mb-3">
              <i className="fas fa-calendar-check me-3"></i>
              Book Your Service
            </h1>

            <p className="text-secondary mb-0 booking-page-subtitle mx-auto">
              Confirm your appointment details and send your request to the service provider.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="mb-0 text-secondary">Loading provider info...</p>
            </div>
          ) : provider ? (
            <>
              <div className="card app-card border-0 booking-provider-card mb-4">
                <div className="card-body p-4 p-lg-5">
                  <div className="row align-items-center g-4">
                    <div className="col-lg-8">
                      <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 text-center text-sm-start">
                        <div className="provider-profile-avatar">
                          <i className="fas fa-bolt"></i>
                        </div>

                        <div>
                          <h2 className="h4 fw-bold mb-1">
                            {provider.firstName} {provider.lastName}
                          </h2>

                          <p className="text-secondary mb-2">
                            {categoryName || "Service Provider"}
                          </p>

                          <div className="provider-rate mb-2">
                            <i className="fas fa-dollar-sign me-1"></i>
                            {provider.hourlyRate}/hour
                          </div>

                          <div className="provider-rating-wrap">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`me-1 ${
                                  i < Math.round(rating.averageRating)
                                    ? "fas fa-star text-warning"
                                    : "far fa-star text-muted"
                                }`}
                              ></i>
                            ))}
                            <span className="ms-2 text-secondary">
                              {rating.averageRating.toFixed(1)} ({rating.totalReviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4 text-lg-end text-center">
                      <span className="badge rounded-pill text-bg-success px-3 py-2">
                        <i className="fas fa-check-circle me-2"></i>
                        Available Today
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card app-card border-0 booking-form-card">
                <div className="card-body p-4 p-lg-5">
                  <h2 className="h4 fw-semibold mb-4">
                    <i className="fas fa-calendar-plus me-2 text-primary"></i>
                    Booking Details
                  </h2>

                  <form id="bookingForm" onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="bookingDate" className="form-label auth-label">
                          Select Date
                        </label>
                        <input
                          type="date"
                          className="form-control auth-input"
                          id="bookingDate"
                          value={formData.bookingDate}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="bookingTime" className="form-label auth-label">
                          Select Time
                        </label>
                        <select
                          className="form-select auth-input"
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

                      <div className="col-md-6">
                        <label htmlFor="customerName" className="form-label auth-label">
                          Your Name
                        </label>
                        <input
                          type="text"
                          className="form-control auth-input"
                          id="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="customerPhone" className="form-label auth-label">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control auth-input"
                          id="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="customerAddress" className="form-label auth-label">
                          Service Address
                        </label>
                        <input
                          type="text"
                          className="form-control auth-input"
                          id="customerAddress"
                          value={formData.customerAddress}
                          onChange={handleChange}
                          placeholder="Enter address"
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="description" className="form-label auth-label">
                          Service Description
                        </label>
                        <textarea
                          className="form-control auth-input auth-textarea"
                          id="description"
                          rows="5"
                          required
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your requirements..."
                        ></textarea>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill px-5 py-3 fw-semibold"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Confirming...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check-circle me-2"></i>
                            Confirm Booking
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="card app-card border-0 text-center p-4 p-md-5">
              <h4 className="fw-semibold mb-2">Provider not found</h4>
              <p className="text-secondary mb-0">
                We couldn’t load the provider information right now.
              </p>
            </div>
          )}
        </div>
      </section>

      {alert && <ModalAlert {...alert} onClose={() => setAlert(null)} />}
    </>
  );
};

export default Booking;