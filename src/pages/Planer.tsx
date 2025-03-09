// import React from "react";
// import CalendarPage from "./CalendarPage"; // นำเข้า CalendarPage

// const Planner: React.FC = () => {
//   return (
//     <div
//       style={{
//         backgroundColor: "#8576FF", // สีพื้นหลังม่วง
//         minHeight: "100vh", // ใช้ min-height แทนเพื่อให้ขยายตามเนื้อหา
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: "20px",
//         gap: "20px", // เพิ่มระยะห่างระหว่างปฏิทินกับกล่องด้านขวา
//       }}
//     >
//       {/* ส่วน Calendar */}
//       <div
//         style={{
//           width: "80%",
//           maxWidth: "1200px",
//           maxHeight: "95vh",
//           backgroundColor: "white",
//           borderRadius: "20px", // มุมโค้ง
//           padding: "20px",
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // เพิ่มเงา
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <div style={{ flex: 1, overflowY: "auto" }}>
//           <CalendarPage />
//         </div>
//       </div>

//       {/* ส่วน Sidebar (Notifications / RightSide) */}
//       <div
//         style={{
//           width: "250px", // กำหนดความกว้างของ Sidebar
//           maxHeight: "85vh",
//           backgroundColor: "white",
//           borderRadius: "20px", // มุมโค้ง
//           padding: "15px",
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // เพิ่มเงา
//           display: "flex",
//           flexDirection: "column",
//           overflowY: "auto", // ให้ scroll ได้ถ้าสูงเกิน
//         }}
//       >
//         {/* ใส่ Notifications หรือ RightSide */}
//         {/* {showNotifications ? (
//           <Nofitications
//             notifications={notifications}
//             onUnreadCountChange={handleUnreadCountChange}
//             setNotifications={setNotifications}
//           />
//         ) : (
//           <RightSide events={events} />
//         )} */}

//         <p style={{ textAlign: "center", color: "#555" }}>Sidebar Content</p>
//       </div>
//     </div>
//   );
// };

// export default Planner;
