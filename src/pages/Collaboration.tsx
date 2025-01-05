import React from "react";
import { CSSProperties } from "react";

const SmartMeetingEdit: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Top Nav (Back link + Title + Right user icon) */}
        <div style={styles.topNav}>
          <div style={styles.leftNavGroup}>
            <a href="#" style={styles.backLink}>
              ← Back
            </a>
            <h2 style={styles.pageTitle}>Smart Meeting / Edit</h2>
          </div>
          <div style={styles.rightNavGroup}>
            <a href="#" style={styles.newTaskLink}>
              + New Task
            </a>
            <div style={styles.avatar}></div>
          </div>
        </div>

        {/* Inner Container */}
        <div style={styles.innerContainer}>
          {/* *** Meeting details *** */}
          <div style={styles.formSection}>
            <h3 style={styles.formSectionHeader}>Meeting details</h3>
            <div style={styles.sectionCard}>
              {/* Name & description row */}
              <div style={{ marginBottom: "16px" }}>
                <label style={styles.fieldLabel}>Name & description</label>
                <input
                  type="text"
                  placeholder="Smart Meeting name"
                  style={styles.input}
                />
              </div>

              {/* Color & category row */}
              <div style={{ marginBottom: "16px" }}>
                <label style={styles.fieldLabel}>Color & category</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <select style={styles.select}>
                    <option value="heart">❤️</option>
                    <option value="star">⭐️</option>
                  </select>
                  <select style={styles.select}>
                    <option value="Team Meeting">Team Meeting</option>
                    <option value="1on1">1:1</option>
                  </select>
                </div>
              </div>

              <div>
                <a href="#" style={styles.addDescriptionLink}>+ Add description</a>
              </div>
            </div>
          </div>

          {/* *** Attendees, hours & locations *** */}
          <div style={styles.formSection}>
            <h3 style={styles.formSectionHeader}>Attendees, hours & locations</h3>
            <div style={styles.sectionCard}>
              <div style={{ marginBottom: "16px" }}>
                <p style={styles.tipText}>
                  To make it super easy to invite team members, allow Reclaim to pull in
                  your contacts from your email account.
                </p>
                <button style={styles.allowBtn}>Allow</button>
              </div>

              <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column" }}>
                <input
                  type="text"
                  placeholder="Search for attendees to add..."
                  style={styles.input}
                />
                <div style={{ marginTop: "8px" }}>
                  <div style={styles.attendeeItem}>
                    <div style={styles.attendeeAvatar}></div>
                    <div>
                      <div style={styles.attendeeName}>You</div>
                      <div style={styles.attendeeEmail}>nnapatsiri@gmail.com</div>
                    </div>
                    <div style={{ marginLeft: "auto", color: "#555" }}>
                      Meeting Hours GMT+7 ▼
                    </div>
                    <div style={{ marginLeft: "8px", color: "#555" }}>*</div>
                  </div>
                </div>
                <div style={styles.warningMsg}>
                  Please add at least one other attendee to this meeting.
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <a href="#" style={styles.addLink}>
                  + Add videoconference link or location
                </a>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <a href="#" style={styles.addLink}>
                  + Add conference room
                </a>
              </div>
            </div>
          </div>

          {/* Save / Cancel Buttons */}
          <div style={styles.bottomBar}>
            <button style={styles.saveBtn}>Save</button>
            <button style={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartMeetingEdit;

//
// ============== Inline Styles ==============
const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    width: "100%",
    height: "100vh",
    backgroundColor: "#f9f9fb",
  },
  sidebar: {
    width: "60px",
    backgroundColor: "#1e1e2f",
    display: "flex",
    flexDirection: "column",
    padding: "12px 0",
  },
  sidebarTop: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  },
  logo: {
    width: "32px",
    height: "32px",
    backgroundColor: "#444",
    borderRadius: "4px",
    marginBottom: "8px",
  },
  menuItem: {
    cursor: "pointer",
    color: "#999",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  topNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "16px 24px",
    borderBottom: "1px solid #eee",
  },
  leftNavGroup: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  backLink: {
    textDecoration: "none",
    color: "#555",
    fontSize: "14px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
  },
  rightNavGroup: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  newTaskLink: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#333",
  },
  avatar: {
    width: "32px",
    height: "32px",
    backgroundColor: "#ccc",
    borderRadius: "50%",
  },
  innerContainer: {
    padding: "24px 32px",
    overflowY: "auto",
  },
  formSection: {
    marginBottom: "24px",
  },
  formSectionHeader: {
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "8px",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  fieldLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "4px",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },
  addDescriptionLink: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#7f6fff",
  },
  tipText: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "8px",
  },
  allowBtn: {
    backgroundColor: "#e0d7ff",
    color: "#6d63fe",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
  },
  attendeeItem: {
    backgroundColor: "#f8f8f8",
    borderRadius: "6px",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  attendeeAvatar: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#bbb",
  },
  attendeeName: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#333",
  },
  attendeeEmail: {
    fontSize: "12px",
    color: "#777",
  },
  warningMsg: {
    marginTop: "8px",
    backgroundColor: "#fff8cc",
    border: "1px solid #f2e59d",
    padding: "8px",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#666",
  },
  addLink: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#7f6fff",
  },
  bottomBar: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  saveBtn: {
    backgroundColor: "#7f6fff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "14px",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    color: "#555",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
  },
};
