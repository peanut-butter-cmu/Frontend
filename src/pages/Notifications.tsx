import React, { useEffect, useState } from "react";
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

const fetchNotifications = async () => {
  return [
    {
      id: 1,
      title: "!!! Sent Database Assignment",
      due: "Due Today 13:00",
      highlighted: true,
      isRead: false,
    },
    {
      id: 2,
      title: "NEW Calculas is assigned",
      due: "Due 12 Mar 2024 23:59",
      isRead: false,
    },
    {
      id: 3,
      title: "Meeting Present 1",
      detail: "Every Monday , 12:00 - 13:15 PM",
      from: "From Napatsiri_p",
      group: "Group Project Boo",
      hasAction: true,
      isRead: false,
    },
    {
      id: 4,
      title: "Database Assignment",
      status: "has been submitted",
      isRead: true,
    },
  ];
};

const Notifications: React.FC<{ onUnreadCountChange: (newCount: number) => void }> = ({ onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // โหลดข้อมูลแจ้งเตือนเมื่อ component mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    loadNotifications();
  }, []);

  // คำนวณ unreadCount ทุกครั้งที่ notifications เปลี่ยนแปลง
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);
  const unreadCount = unreadNotifications.length;

  // ส่งค่า unreadCount ให้ parent ทุกครั้งที่เปลี่ยนแปลง
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
