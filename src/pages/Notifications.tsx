import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { useSMCalendar } from "smart-calendar-lib";
import Swal from "sweetalert2";

type Notification = {
  createdAt: string;
  data: { eventId: number; eventTitle: string; member?: string; email: string };
  id: number;
  read: boolean;
  type: string;
};

const Notifications: React.FC<{
  onUnreadCountChange: (newCount: number) => void;
}> = ({ onUnreadCountChange }) => {
  const smCalendar = useSMCalendar();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sharedEvents, setSharedEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [notificationsResponse, sharedEventsResponse] = await Promise.all(
          [smCalendar.getNotifications(), smCalendar.getSharedEvents()]
        );

        console.log("NotificationsResponse:", notificationsResponse);
        console.log("SharedEventsResponse:", sharedEventsResponse);

        const apiNotifications = notificationsResponse.notifications.map(
          (n: any) => ({
            createdAt: n.createdAt,
            data: n.data,
            id: n.id,
            read: n.read,
            type: n.type,
          })
        );
        setNotifications(apiNotifications);
        setSharedEvents(sharedEventsResponse.sharedEvents || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  const formatSimpleDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const getIdealTimeRangeFromSharedEvents = (eventId: number): string => {
    const sharedEvent = sharedEvents.find((e) => e.id === eventId);
    if (sharedEvent && sharedEvent.idealTimeRange) {
      const { startDate, endDate } = sharedEvent.idealTimeRange;
      return `${formatSimpleDate(startDate)} - ${formatSimpleDate(endDate)}`;
    }
    return "N/A";
  };
  const getDurationFromSharedEvents = (eventId: number): string => {
    const sharedEvent = sharedEvents.find((e) => e.id === eventId);
    if (sharedEvent && sharedEvent.duration != null) {
      const durationMinutes = sharedEvent.duration;
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return `${hours} hour ${minutes} min`;
    }
    return "N/A";
  };
  const getMemberFromSharedEvent = (eventId: number): string => {
    const sharedEvent = sharedEvents.find((e) => e.id === eventId);
    if (sharedEvent && sharedEvent.members && sharedEvent.members.length > 0) {
      const owner = sharedEvent.members.find((m: any) => m.sharedEventOwner);
      const member = owner || sharedEvent.members[0];
      return `${member.firstName} ${member.lastName}`;
    }
    return "N/A";
  };
  const getFormattedDateTimeFromSharedEvent = (eventId: number): string => {
    const sharedEvent = sharedEvents.find((e) => e.id === eventId);
    if (sharedEvent && sharedEvent.members && sharedEvent.members.length > 0) {
      const member =
        sharedEvent.members.find((m: any) => m.sharedEventOwner) ||
        sharedEvent.members[0];
      if (member && member.events && member.events.length > 0) {
        const event = member.events[0];
        if (event.start && event.end) {
          const start = new Date(event.start);
          const end = new Date(event.end);
          const day = start.getUTCDate().toString().padStart(2, "0");
          const month = start.toLocaleString("en-US", {
            month: "short",
            timeZone: "UTC",
          });
          const year = start.getUTCFullYear();
          const startTime = `${start
            .getUTCHours()
            .toString()
            .padStart(2, "0")}:${start
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")}`;
          const endTime = `${end
            .getUTCHours()
            .toString()
            .padStart(2, "0")}:${end
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")}`;
          return `${day} ${month} ${year} ${startTime}-${endTime}`;
        }
      }
    }
    return "N/A";
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
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error updating notifications read status:", error);
    }
  };

  const handleClickNotification = async (id: number) => {
    try {
      await smCalendar.updateNotificationRead(id);
      markAsRead(id);
    } catch (error) {
      console.error("Error updating notification read status:", error);
    }
  };

  const handleAccept = async (eventId: number, notificationId: number) => {
    try {
      await smCalendar.postAcceptSharedEvent(eventId);
      Swal.fire({
        title: "Accepted!",
        text: "The shared event has been accepted successfully.",
        icon: "success",
        showConfirmButton: false,
      });
      handleClickNotification(notificationId);
    } catch (error) {
      console.error("Error accepting shared event:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to accept the shared event.",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  const handleCancel = async (eventId: number, notificationId: number) => {
    try {
      await smCalendar.postRejectSharedEvent(eventId);
      Swal.fire({
        title: "Cancelled!",
        text: "The shared event has been cancelled successfully.",
        icon: "success",
        showConfirmButton: false,
      });
      handleClickNotification(notificationId);
    } catch (error) {
      console.error("Error rejecting shared event:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to cancel the shared event.",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  const renderNotificationContent = (item: Notification) => {
    switch (item.type) {
      case "event_created":
        return (
          <>
            <div
              style={{
                fontWeight: "400",
                fontSize: "17px",
                marginBottom: "5px",
              }}
            >
              Group {item.data.eventTitle} has been created
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "300",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              Date: {getIdealTimeRangeFromSharedEvents(item.data.eventId)}
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "300",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              Duration: {getDurationFromSharedEvents(item.data.eventId)}
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "300",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              From: {getMemberFromSharedEvent(item.data.eventId)}
            </div>
            {!item.read && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccept(item.data.eventId, item.id);
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
                    handleCancel(item.data.eventId, item.id);
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
          </>
        );
      case "event_scheduled":
        return (
          <>
            <div
              style={{
                fontWeight: "400",
                fontSize: "17px",
                marginBottom: "5px",
              }}
            >
              Group {item.data.eventTitle} has been saved
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "300",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              Date: {getFormattedDateTimeFromSharedEvent(item.data.eventId)}
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "300",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              Duration: {getDurationFromSharedEvents(item.data.eventId)}
            </div>
          </>
        );
      case "event_deleted":
        return (
          <div
            style={{ fontWeight: "400", fontSize: "17px", marginBottom: "5px" }}
          >
            {item.data.eventTitle} has been deleted
          </div>
        );
      case "event_reminder":
        return (
          <div
            style={{ fontWeight: "400", fontSize: "17px", marginBottom: "5px" }}
          >
            Reminder: {item.data.eventTitle}
          </div>
        );
      case "invite_accepted":
        return (
          <>
            <div
              style={{
                fontWeight: "400",
                fontSize: "17px",
                marginBottom: "5px",
              }}
            >
              {item.data.email}
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "300",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              accepted your invitation.
            </div>
          </>
        );
      case "invite_rejected":
        return (
          <>
            <div
              style={{
                fontWeight: "400",
                fontSize: "17px",
                marginBottom: "5px",
              }}
            >
              {item.data.email} declined your invitation.
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "300",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              declined your invitation.
            </div>
          </>
        );
      default:
        return (
          <div
            style={{ fontWeight: "400", fontSize: "17px", marginBottom: "5px" }}
          >
            {item.data.eventTitle}
          </div>
        );
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
                  {renderNotificationContent(item)}
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
                  style={{ cursor: "pointer", padding: "10px" }}
                >
                  {renderNotificationContent(item)}
                </div>
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
