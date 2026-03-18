import React, { useEffect, useState } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../components/ReviewModal";

const API_BASE_URL =
  "https://skillsquare-live-api-b9czenhchfhxdwbp.centralindia-01.azurewebsites.net";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchNotifications = async () => {
      try {
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
        console.log("SignalR connected");

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

      const role = localStorage.getItem("role");
      if (role === "Provider") {
        navigate("/provider/my-bookings");
      } else {
        navigate("/my-bookings");
      }
    } catch (err) {
      console.error("Error handling notification click:", err);
    }
  };

  return (
    <main className="notification-content">
      <div className="container">
        <h1 className="notification-page-title">
          <i className="fas fa-bell me-3"></i>Notifications
        </h1>

        <div className="notifications-container mx-auto">
          {notifications.length === 0 && (
            <div className="text-center p-5 text-muted">
              <i className="far fa-bell-slash fa-3x mb-3"></i>
              <p>No notifications yet.</p>
            </div>
          )}

          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (!notif.isRead) {
                  handleNotificationClick(notif);
                }
              }}
              className="notification-card"
              style={{
                cursor: notif.isRead ? "default" : "pointer",
                opacity: notif.isRead ? 0.6 : 1,
                backgroundColor: notif.isRead ? "#f9f9f9" : "#fff",
              }}
            >
              <div
                className={`notification-status ${
                  notif.isRead ? "read" : "unread"
                }`}
              ></div>

              <div className="d-flex align-items-start">
                <div className="notification-avatar">
                  {notif.type === "BookingCompleted" ||
                  (notif.message && notif.message.includes("review")) ? (
                    <i className="fas fa-star notification-icon"></i>
                  ) : (
                    <i className="fas fa-bell notification-icon"></i>
                  )}
                </div>

                <div className="notification-content">
                  <div className="notification-title">{notif.message}</div>
                  <div className="notification-time">
                    <i className="fas fa-clock me-1"></i>
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        bookingId={selectedBookingId}
        onSuccess={() => {
          navigate("/my-bookings");
        }}
      />
    </main>
  );
};

export default Notifications;