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
    <section className="app-section bg-light min-vh-100" style={{ paddingTop: '110px' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="font-display fw-bold text-dark mb-2">
            <i className="fas fa-bell me-2" style={{ color: 'var(--app-primary)' }}></i>
            {isProviderView ? "Provider Notifications" : "Notifications"}
          </h1>
          <p className="text-secondary font-body mb-0 mx-auto" style={{ maxWidth: '600px' }}>
            Stay updated with your latest bookings, service activity, and review requests.
          </p>
        </div>

        <div className="mx-auto" style={{ maxWidth: '750px' }}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="mb-0 text-secondary font-body">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="card app-card border-0 text-center p-5 rounded-4 shadow-sm bg-white">
              <div className="mb-4" style={{ fontSize: '3rem', color: 'var(--app-primary)', opacity: '0.5' }}>
                <i className="far fa-bell-slash"></i>
              </div>
              <h4 className="font-display fw-bold mb-2">No notifications yet</h4>
              <p className="text-secondary font-body mb-0">
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
                  className="card app-card border-0 w-100 text-start p-3 p-md-4 rounded-4 shadow-sm"
                  style={{ 
                    background: notif.isRead ? '#f8fafc' : '#ffffff', 
                    borderLeft: notif.isRead ? 'none' : '4px solid var(--app-primary)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="d-flex align-items-start gap-3">
                    <div 
                      className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '48px', height: '48px', fontSize: '1.2rem',
                        background: notif.isRead ? 'rgba(100, 116, 139, 0.1)' : 'rgba(242, 122, 33, 0.1)', 
                        color: notif.isRead ? '#64748b' : 'var(--app-primary)' 
                      }}
                    >
                      {notif.type === "BookingCompleted" || (notif.message && notif.message.includes("review")) ? (
                        <i className="fas fa-star"></i>
                      ) : (
                        <i className="fas fa-bell"></i>
                      )}
                    </div>
                    
                    <div className="flex-grow-1 font-body">
                      <div className={`mb-1 ${notif.isRead ? 'text-secondary' : 'text-dark fw-bold'}`}>
                        {notif.message}
                      </div>
                      <div className="text-secondary small">
                        <i className="fas fa-clock me-1"></i>
                        {new Date(notif.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                    
                    {!notif.isRead && (
                      <div className="flex-shrink-0 mt-2">
                        <div className="rounded-circle bg-primary" style={{ width: '10px', height: '10px' }}></div>
                      </div>
                    )}
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