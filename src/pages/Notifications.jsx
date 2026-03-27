import React, { useEffect, useState } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../components/ReviewModal";

const API_BASE_URL =
  "https://skillsquare-live-api-b9czenhchfhxdwbp.centralindia-01.azurewebsites.net";

const Notifications = ({ isProviderView = false }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/Notification/myNotifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/notificationHub`, {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        connection.on("ReceiveNotification", (message) => {
          const newNotif =
            typeof message === "string"
              ? {
                  id: Date.now(),
                  message: message,
                  isRead: false,
                  createdAt: new Date(),
                }
              : message;

          setNotifications((prev) => [newNotif, ...prev]);
        });
      })
      .catch((err) => {
        console.error("SignalR connection error:", err);
      });

    return () => {
      connection.stop();
    };
  }, []);

  const handleNotificationClick = async (notif) => {
    try {
      const token = localStorage.getItem("token");

      if (!notif.isRead) {
        await axios.put(
          `${API_BASE_URL}/api/Notification/${notif.id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );

      const isReviewType = notif.type === "BookingCompleted";
      const isReviewMessage =
        notif.message &&
        (notif.message.includes("marked as completed") ||
          notif.message.includes("leave a review"));

      if (isReviewType || isReviewMessage) {
        let bookingId = notif.bookingId;

        if (!bookingId && notif.message) {
          const idMatch = notif.message.match(/#(\d+)/);
          if (idMatch) bookingId = idMatch[1];
        }

        if (bookingId) {
          setSelectedBookingId(bookingId);
          setIsReviewModalOpen(true);
          return;
        }
      }

      if (isProviderView) {
        navigate("/provider/my-bookings");
      } else {
        navigate("/my-bookings");
      }
    } catch (err) {
      console.error("Error handling notification click:", err);
    }
  };

  return (
    <section className="app-section app-section-hero notifications-page">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
            Alerts & Updates
          </span>

          <h1 className="app-section-title mb-3">
            <i className="fas fa-bell me-3"></i>
            {isProviderView ? "Provider Notifications" : "Notifications"}
          </h1>

          <p className="text-secondary mb-0 notifications-subtitle mx-auto">
            Stay updated with your latest bookings, service activity, and review requests.
          </p>
        </div>

        <div className="notifications-list-wrap mx-auto">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="mb-0 text-secondary">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="card app-card border-0 text-center p-4 p-md-5 search-empty-card">
              <div className="search-empty-icon mb-3">
                <i className="far fa-bell-slash"></i>
              </div>
              <h4 className="fw-semibold mb-2">No notifications yet</h4>
              <p className="text-secondary mb-0">
                New alerts and booking updates will appear here.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  type="button"
                  onClick={() => handleNotificationClick(notif)}
                  className={`notification-item-card ${
                    notif.isRead ? "is-read" : "is-unread"
                  }`}
                >
                  <div
                    className={`notification-item-status ${
                      notif.isRead ? "read" : "unread"
                    }`}
                  ></div>

                  <div className="notification-item-avatar">
                    {notif.type === "BookingCompleted" ||
                    (notif.message && notif.message.includes("review")) ? (
                      <i className="fas fa-star"></i>
                    ) : (
                      <i className="fas fa-bell"></i>
                    )}
                  </div>

                  <div className="notification-item-content text-start">
                    <div className="notification-item-title">{notif.message}</div>
                    <div className="notification-item-time">
                      <i className="fas fa-clock me-1"></i>
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        bookingId={selectedBookingId}
        onSuccess={() => {
          if (isProviderView) {
            navigate("/provider/my-bookings");
          } else {
            navigate("/my-bookings");
          }
        }}
      />
    </section>
  );
};

export default Notifications;