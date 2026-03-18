import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [category, setCategory] = useState([]);
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });

  const handleBooking = () => {
    navigate(`/book-a-technitian/${provider.id}`);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [providerRes, reviewRes, categoryRes, ratingRes] =
          await Promise.all([
            api.get(`/Provider/${id}`),
            api.get(`/Review/provider/${id}`),
            api.get("/ServiceCategory"),
            api.get(`/Review/average/${id}`),
          ]);

        setProvider(providerRes.data);
        setReviews(reviewRes.data);
        setCategory(categoryRes.data);
        setRating(ratingRes.data);

        console.log(reviewRes.data);
      } catch (error) {
        console.log("Error while fetching Provider Details", error.message);
      }
    };

    fetchAll();
  }, [id]);
  const categoryName = category.find(
    (c) => c.id === provider?.categoryId
  )?.title;

  return (
    <>
      {!provider ? (
        <p>Loading...</p>
      ) : (
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-8">
              <div className="profile-card">
                <div className="row">
                  <div className="col-md-3 text-center text-md-start">
                    <div className="profile-avatar mx-auto mx-md-0">
                      <i className="fas fa-bolt"></i>
                    </div>
                  </div>
                  <div className="col-md-9 text-center text-md-start">
                    <h1 className="profile-name">
                      {`${provider.firstName} ${provider.lastName}`}
                    </h1>
                    <p className="profile-title">{categoryName}</p>

                    <div className="rating-container justify-content-center justify-content-md-start">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={
                              i < Math.round(rating.averageRating)
                                ? "fas fa-star"
                                : "far fa-star"
                            }
                          ></i>
                        ))}
                      </div>
                      <span className="rating-text">
                        {rating.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h2 className="section-title">
                  <i className="fas fa-user me-2"></i>About {provider.firstName}
                </h2>
                <p className="about-text">
                  {provider.bio}
                  <br />
                  {provider.skills}
                </p>
              </div>

              <div className="profile-card">
                <h2 className="section-title">
                  <i className="fas fa-star me-2"></i>Customer Reviews
                </h2>

                {reviews.length === 0 ? (
                  <p className="text-muted">No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="review-item mb-3">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <i className="fas fa-user"></i>
                        </div>

                        <div className="reviewer-details flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6>{review.customerName}</h6>
                            <span className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="review-stars text-warning">
                            {Array.from({ length: 5 }, (_, i) => (
                              <i
                                key={i}
                                className={`fa-star ${
                                  i < review.rating ? "fas" : "far"
                                }`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="review-text mt-2">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="col-lg-4 mt-4">
              <div className="booking-card">
                <h3 className="booking-title">
                  <i className="fas fa-calendar-check me-2"></i>Book{" "}
                  {provider.firstName}
                </h3>

                <button className="btn btn-book" onClick={handleBooking}>
                  <i className="fas fa-calendar-plus me-2"></i>Book Appointment
                </button>

                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <strong>Phone</strong>
                    <br />
                    <span>{provider.phoneNumber}</span>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <strong>Email</strong>
                    <br />
                    <span>{provider.email}</span>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <strong>Service Area</strong>
                    <br />
                    <span>{provider.area + ", " + provider.address}</span>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="fas fa-dollar-sign"></i>
                  <div>
                    <strong>Starting Rate</strong>
                    <br />
                    <span>${provider.hourlyRate}/hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProviderDetails;
