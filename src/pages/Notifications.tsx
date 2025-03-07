import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { useSMCalendar } from "smart-calendar-lib";

// กำหนด type ของ Notification ตาม schema ที่ API ส่งมา
type Notification = {
  createdAt: string;
  data: { eventId: number };
  id: number;
  read: boolean;
  type: string;
};

const Notifications: React.FC<{ onUnreadCountChange: (newCount: number) => void }> = ({ onUnreadCountChange }) => {
  const smCalendar = useSMCalendar();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ดึงข้อมูลจาก API แล้วใช้แค่ field ที่กำหนดไว้
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await smCalendar.getNotifications();
        console.log("NotificationsResponse:", response);
        // map เฉพาะ field ที่ต้องการ
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

  // Helper function เพื่อ format วันที่ให้อยู่ในรูปแบบ "Create 12 Mar 2024 23:59"
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `Create : ${day} ${month} ${year} ${hours}:${minutes}`;
  };

  // คำนวณจำนวนการแจ้งเตือนที่ยังไม่อ่าน
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);
  const unreadCount = unreadNotifications.length;

  // ส่งค่าจำนวน unread ให้ parent component
  useEffect(() => {
    onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // ฟังก์ชันสำหรับ mark all notifications เป็น read
  const handleReadAll = async () => {
    try {
      await smCalendar.updateNotificationsReadAll();
      console.log("All notifications marked as read");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Error updating notifications read status:", error);
    }
  };

  const handleClickNotification = async (id: number) => {
    try {
      // เรียกใช้ API updateNotificationRead ส่ง id ไปด้วย
      await smCalendar.updateNotificationRead(id);
      // อัปเดต state ให้ notification นั้นเป็น read
      markAsRead(id);
      console.log(`Notification ${id} clicked and marked as read`);
    } catch (error) {
      console.error("Error updating notification read status:", error);
    }
  };
  
  // เมื่อกด Accept ให้เรียกใช้ smCalendar.postAcceptSharedEvent โดยส่ง eventId ที่ได้จาก data.eventId
  const handleAccept = async (eventId: number) => {
    try {
      console.log(eventId);
      await smCalendar.postAcceptSharedEvent(eventId);
      console.log(`Accepted shared event with eventId: ${eventId}`);
      // Optionally update UI หรือ mark notification เป็น read ได้ที่นี่
    } catch (error) {
      console.error("Error accepting shared event:", error);
    }
  };

  // เมื่อกด Cancel ให้เรียกใช้ smCalendar.postRejectSharedEvent โดยส่ง eventId ที่ได้จาก data.eventId
  const handleCancel = async (eventId: number) => {
    try {
      console.log(eventId);
      await smCalendar.postRejectSharedEvent(eventId);
      console.log(`Rejected shared event with eventId: ${eventId}`);
      // Optionally update UI หรือ mark notification เป็น read ได้ที่นี่
    } catch (error) {
      console.error("Error rejecting shared event:", error);
    }
  };

  return (
    <div style={{ padding: "15px", background: "#fff", width: "20%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "500" }}>Notifications</h2>
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
          style={{ background: "#fff", color: "#000", border: "none", borderRadius: "4px", padding: "5px 10px", cursor: "pointer", fontSize: "14px" }}
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
                <div style={{ fontWeight: "400", fontSize: "17px", marginBottom: "5px" }}>
                  {item.type === "event_created"
                    ? `Event ID: ${item.data.eventId}`
                    : `Type: ${item.type}`}
                </div>
                <div style={{ fontSize: "15px", fontWeight: "300", color: "#555", marginBottom: "5px" }}>
                  {formatDateTime(item.createdAt)}
                </div>

                {/* เฉพาะเมื่อ type เป็น "event_created" ให้แสดงปุ่ม Accept/Cancel */}
                {item.type === "event_created" && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "5px", marginBottom: "5px", justifyContent: "center" }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(item.data.eventId);
                      }}
                      style={{ background: "#15B392", color: "#fff", border: "none", borderRadius: "4px", padding: "3px 15px", cursor: "pointer" }}
                    >
                      Accept
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(item.data.eventId);
                      }}
                      style={{ background: "#FF0000", color: "#fff", border: "none", borderRadius: "4px", padding: "3px 15px", cursor: "pointer" }}
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
                  ? `Event ID: ${item.data.eventId}`
                  : `Type: ${item.type}`}
              </div>
              <div style={{ fontSize: "15px", fontWeight: "300", color: "#555", marginBottom: "5px" }}>
                {formatDateTime(item.createdAt)}
              </div>

              {item.type === "event_created" && (
                <div style={{ display: "flex", gap: "10px", marginTop: "5px", marginBottom: "5px", justifyContent: "center" }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(item.data.eventId);
                    }}
                    style={{ background: "#15B392", color: "#fff", border: "none", borderRadius: "4px", padding: "3px 15px", cursor: "pointer" }}
                  >
                    Accept
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel(item.data.eventId);
                    }}
                    style={{ background: "#FF0000", color: "#fff", border: "none", borderRadius: "4px", padding: "3px 15px", cursor: "pointer" }}
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
