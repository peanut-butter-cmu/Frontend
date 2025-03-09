import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { useSMCalendar } from "smart-calendar-lib";

type Notification = {
  createdAt: string;
  data: { eventId: number; eventTitle: string };
  id: number;
  read: boolean;
  type: string;
};

const Notifications: React.FC<{
  onUnreadCountChange: (newCount: number) => void;
}> = ({ onUnreadCountChange }) => {
  const smCalendar = useSMCalendar();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await smCalendar.getNotifications();
        const event = await smCalendar.getSharedEvents();
        console.log("NotificationsResponse:", response);
        console.log("event:", event);
        const apiNotifications = response.notifications.map((n: any) => ({
          createdAt: n.createdAt,
          data: n.data,
          id: n.id,
          read: n.read,
          type: n.type,
        }));
        setNotifications(apiNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    loadNotifications();
  }, []);

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `Create : ${day} ${month} ${year} ${hours}:${minutes}`;
  };
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);
  const unreadCount = unreadNotifications.length;

  useEffect(() => {
    onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleReadAll = async () => {
    try {
      await smCalendar.updateNotificationsReadAll();
      console.log("All notifications marked as read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error updating notifications read status:", error);
    }
  };

  const handleClickNotification = async (id: number) => {
    try {
      await smCalendar.updateNotificationRead(id);
      markAsRead(id);
      console.log(`Notification ${id} clicked and marked as read`);
    } catch (error) {
      console.error("Error updating notification read status:", error);
    }
  };

  const handleAccept = async (eventId: number) => {
    try {
      console.log(eventId);
      await smCalendar.postAcceptSharedEvent(eventId);
      console.log(`Accepted shared event with eventId: ${eventId}`);
    } catch (error) {
      console.error("Error accepting shared event:", error);
    }
  };

  const handleCancel = async (eventId: number) => {
    try {
      console.log(eventId);
      await smCalendar.postRejectSharedEvent(eventId);
      console.log(`Rejected shared event with eventId: ${eventId}`);
    } catch (error) {
      console.error("Error rejecting shared event:", error);
    }
  };

  return (
    <div style={{ padding: "15px", background: "#fff", width: "20%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "15px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "500" }}>
            Notifications
          </h2>
          <div
            style={{
              background: "red",
              color: "#fff",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "400",
              marginLeft: "3px",
            }}
          >
            {unreadCount}
          </div>
        </div>
        <button
          onClick={handleReadAll}
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Mark all as read
        </button>
      </div>
      <Divider sx={{ borderColor: "#ddd", mb: 2 }} />
      <div style={{ maxHeight: "900px", overflowY: "auto" }}>
        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <div>
            {unreadNotifications.map((item) => (
              <React.Fragment key={item.id}>
                <div
                  onClick={() => handleClickNotification(item.id)}
                  style={{
                    background: "#f9f9f9",
                    borderRadius: "5px",
                    padding: "10px",
                    marginBottom: "10px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "400",
                      fontSize: "17px",
                      marginBottom: "5px",
                    }}
                  >
                    {item.type === "event_created"
                      ? `Group ${item.data.eventTitle} has been created`
                      : `Type: ${item.type}`}
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "300",
                      color: "#555",
                      marginBottom: "5px",
                    }}
                  >
                    {formatDateTime(item.createdAt)}
                  </div>

                  {/* เฉพาะเมื่อ type เป็น "event_created" ให้แสดงปุ่ม Accept/Cancel */}
                  {item.type === "event_created" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "5px",
                        marginBottom: "5px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(item.data.eventId);
                        }}
                        style={{
                          background: "#15B392",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "3px 15px",
                          cursor: "pointer",
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(item.data.eventId);
                        }}
                        style={{
                          background: "#FF0000",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "3px 15px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Read Notifications */}
        {readNotifications.length > 0 && (
          <div>
            {readNotifications.map((item) => (
              <React.Fragment key={item.id}>
                <div
                  onClick={() => handleClickNotification(item.id)}
                  style={{
                    fontWeight: "400",
                    fontSize: "17px",
                    marginBottom: "5px",
                    cursor: "pointer",
                  }}
                >
                  {item.type === "event_created"
                    ? `Group ${item.data.eventTitle} has been created`
                    : `Type: ${item.type}`}
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "300",
                    color: "#555",
                    marginBottom: "5px",
                  }}
                >
                  {formatDateTime(item.createdAt)}
                </div>

                {item.type === "event_created" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "5px",
                      marginBottom: "5px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(item.data.eventId);
                      }}
                      style={{
                        background: "#15B392",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "3px 15px",
                        cursor: "pointer",
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(item.data.eventId);
                      }}
                      style={{
                        background: "#FF0000",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "3px 15px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <Divider sx={{ borderColor: "#ddd", mb: 1, mt: 1 }} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;