import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import ModalAlert from "../components/ModalAlert";

const Booking = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [category, setCategory] = useState([]);

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
      }
    };

    fetchProviderData();
  }, [id]);

  const categoryName = category.find(
    (c) => c.id === provider?.categoryId
  )?.title;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        providerId: id, // attach provider id
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        description: formData.description,
      };

      const res = await api.post("/Booking", bookingData);
      setAlert({
        type: "success",
        title: "Booked",
        message:
          "Your Booking is Confirmed , please clcik to See Bookings to check your bookings.",
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
      alert("Failed to create booking");
    }
  };

  return (
    <>
      <div className="booking-content mt-5">
        <div className="container">
          <h1 className="booking-page-title">
            <i className="fas fa-calendar-check me-3"></i>Book Your Service
          </h1>

          {provider ? (
            <div className="technician-card">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <div className="technician-avatar">
                      <i className="fas fa-bolt"></i>
                    </div>
                    <div>
                      <div className="technician-name">
                        {provider.firstName} {provider.lastName}
                      </div>
                      <div className="technician-role">{categoryName}</div>
                      <div className="technician-rate">
                        <i className="fas fa-dollar-sign me-1"></i>$
                        {provider.hourlyRate}/hour
                      </div>
                      <div className="booking-rating-container">
                        <div className="booking-starts">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star${
                                i < Math.floor(rating.averageRating)
                                  ? ""
                                  : "-half-alt"
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="booking-rating-text">
                          {rating.averageRating.toFixed(1)} (
                          {rating.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <div className="badge bg-success p-2">
                    <i className="fas fa-check-circle me-1"></i>Available Today
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading provider info...</p>
          )}

          <div className="booking-form-section">
            <h2 className="form-title">
              <i className="fas fa-calendar-plus me-2"></i>Booking Details
            </h2>

            <form id="bookingForm" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-4">
                    <label htmlFor="bookingDate" className="form-label">
                      <i className="fas fa-calendar form-icon"></i>Select Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <label htmlFor="bookingTime" className="form-label">
                      <i className="fas fa-clock form-icon"></i>Select Time
                    </label>
                    <select
                      className="form-control time-select"
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
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-4">
                    <label htmlFor="customerName" className="form-label">
                      <i className="fas fa-user form-icon"></i>Your Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <label htmlFor="customerPhone" className="form-label">
                      <i className="fas fa-phone form-icon"></i>Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="customerAddress" className="form-label">
                  <i className="fas fa-map-marker-alt form-icon"></i>Service
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="bookingNotes" className="form-label">
                  <i className="fas fa-comment-dots form-icon"></i>Service
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="5"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your requirements..."
                ></textarea>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-book-now">
                  <i className="fas fa-check-circle me-2"></i>Confirm Booking
                </button>
              </div>
            </form>
            {alert && (
              <ModalAlert
                {...alert}
                onClose={() => setAlert(null)} // modal band karne ke liye
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;
