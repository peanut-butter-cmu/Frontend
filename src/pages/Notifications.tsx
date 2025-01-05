// Notifications.tsx
import React, { useEffect } from "react";
import Divider from "@mui/material/Divider";

type Notification = {
  id: number;
  title: string;
  due?: string;
  detail?: string;
  from?: string;
  group?: string;
  hasAction?: boolean;
  isRead: boolean;
  highlighted?: boolean;
  status?: string;
};

interface NotificationsProps {
  notifications: Notification[];
  onUnreadCountChange: (newCount: number) => void;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onUnreadCountChange, setNotifications }) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClickNotification = (id: number) => {
    markAsRead(id);
    console.log(`Notification ${id} clicked`);
  };

  // แยกการแจ้งเตือนเป็น unread และ read
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  return (
    <div
      style={{
        padding: "15px",
        background: "#fff",
        width: "20%",
      }}
    >
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
        {/* Mark All Read Button */}
        <button
          onClick={markAllAsRead}
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

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <div>
          {unreadNotifications.map((item) => (
            <React.Fragment key={item.id}>
              <div
                style={{
                  background: item.highlighted ? "#fff7f7" : "#f9f9f9",
                  borderRadius: "5px",
                  padding: "10px",
                  marginBottom: "10px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
                onClick={() => handleClickNotification(item.id)}
              >
                <div
                  style={{
                    fontWeight: "400",
                    fontSize: "17px",
                    color: item.highlighted ? "red" : "#000",
                    marginBottom: "-3px",
                  }}
                >
                  {item.title}
                </div>

                {item.due && (
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "300",
                      color: "#555",
                      marginBottom: "5px",
                    }}
                  >
                    {item.due}
                  </div>
                )}
                {item.detail && (
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "300",
                      color: "#555",
                      marginBottom: "2px",
                    }}
                  >
                    {item.detail}
                  </div>
                )}
                {item.from && (
                  <div style={{ fontSize: "14px", color: "#555" }}>
                    {item.from}
                  </div>
                )}
                {item.group && (
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "5px",
                    }}
                  >
                    {item.group}
                  </div>
                )}
                {item.hasAction && (
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
                {item.status && (
                  <div
                    style={{ fontSize: "15px", fontWeight: "300", color: "#555" }}
                  >
                    {item.status}
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
                style={{
                  fontWeight: "400",
                  fontSize: "17px",
                  color: item.highlighted ? "red" : "#000",
                  marginBottom: "-3px",
                  cursor: "pointer",
                }}
                onClick={() => handleClickNotification(item.id)}
              >
                {item.title}
              </div>

              {item.due && (
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "300",
                    color: "#555",
                    marginBottom: "5px",
                  }}
                >
                  {item.due}
                </div>
              )}
              {item.detail && (
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "300",
                    color: "#555",
                    marginBottom: "2px",
                  }}
                >
                  {item.detail}
                </div>
              )}
              {item.from && (
                <div style={{ fontSize: "14px", color: "#555" }}>
                  {item.from}
                </div>
              )}
              {item.group && (
                <div
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    marginBottom: "5px",
                  }}
                >
                  {item.group}
                </div>
              )}
              {item.hasAction && (
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
              {item.status && (
                <div
                  style={{ fontSize: "15px", fontWeight: "300", color: "#555" }}
                >
                  {item.status}
                </div>
              )}
              <Divider sx={{ borderColor: "#ddd", mb: 1, mt: 1 }} />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
