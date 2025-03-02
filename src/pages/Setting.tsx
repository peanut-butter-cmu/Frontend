import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import { Button, TextField, Typography, Box } from "@mui/material";
import AccessTokenPopup from "../pages/components/popupToken";
import { useSMCalendar } from "smart-calendar-lib";
import Swal from "sweetalert2";
import { Switch } from "@mui/material";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const Settings: React.FC = () => {
  const smCalendar = useSMCalendar();
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mangoToken, setMangoToken] = useState("");
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>(
    {}
  );
  const [priorities, setPriorities] = useState<
    { label: string; priority: string }[]
  >([]);
  const [selections, setSelections] = useState<
    { label: string; selected: string }[]
  >([]);
  const [categories, setCategories] = useState<
    { label: string; reminders: string[] }[]
  >([]);

  const convertMinutesToReminderLabel = (minutes: number): string => {
    const mapping: Record<number, string> = {
      0: "atStart",
      5: "5min",
      10: "10min",
      15: "15min",
      30: "30min",
      60: "1hour",
      120: "2hour",
      1440: "1day",
      2880: "2day",
      10080: "1week",
    };
    return mapping[minutes] || "none";
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await smCalendar.getGroups();
        console.log("Groups Data:", groups);

        if (!Array.isArray(groups)) {
          console.error("Invalid response format:", groups);
          return;
        }
        const systemGroups = groups.filter((group) => group.type === "system");
        const newCategoryColors: Record<string, string> = {};
        const newPriorities: { label: string; priority: string }[] = [];
        const newSelections: { label: string; selected: string }[] = [];
        const newCategories: { label: string; reminders: string[] }[] = [];

        systemGroups.forEach((group) => {
          let categoryTitle = group.title;

          if (categoryTitle === "Final" || categoryTitle === "Midterm") {
            categoryTitle = "Exam";
          }
          newCategoryColors[categoryTitle] = group.color;

          const existingExam = newPriorities.find((p) => p.label === "Exam");

          let priorityLabel = "Low Priority";
          if (group.priority === 2) priorityLabel = "Medium Priority";
          else if (group.priority === 3) priorityLabel = "High Priority";

          if (categoryTitle === "Exam") {
            if (existingExam) {
              existingExam.priority =
                group.priority >
                (existingExam.priority === "Low Priority"
                  ? 1
                  : existingExam.priority === "Medium Priority"
                  ? 2
                  : 3)
                  ? priorityLabel
                  : existingExam.priority;
            } else {
              newPriorities.push({ label: "Exam", priority: priorityLabel });
            }
          } else {
            newPriorities.push({
              label: categoryTitle,
              priority: priorityLabel,
            });
          }

          const selectedValue = group.isBusy ? "busy" : "free";

          if (categoryTitle === "Exam") {
            const existingSelection = newSelections.find(
              (s) => s.label === "Exam"
            );
            if (!existingSelection) {
              newSelections.push({ label: "Exam", selected: selectedValue });
            }
          } else {
            newSelections.push({
              label: categoryTitle,
              selected: selectedValue,
            });
          }

          const reminders =
            Array.isArray(group.reminders) &&
            group.reminders.every((r) => typeof r === "number")
              ? group.reminders.map((r) => convertMinutesToReminderLabel(r))
              : ["none"];

          if (categoryTitle === "Exam") {
            const existingCategory = newCategories.find(
              (c) => c.label === "Exam"
            );
            if (existingCategory) {
              existingCategory.reminders = [
                ...new Set([...existingCategory.reminders, ...reminders]),
              ];
            } else {
              newCategories.push({ label: "Exam", reminders });
            }
          } else {
            newCategories.push({ label: categoryTitle, reminders });
          }
        });

        setCategoryColors(newCategoryColors);
        setPriorities(newPriorities);
        setSelections(newSelections);
        setCategories(newCategories);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(
    null
  );

  const predefinedColors = [
    "#615EFC",
    "#41B3A2",
    "#FCCD2A",
    "#FF9100",
    "#FF0000",
    "#9A7E6F",
  ];

  const handleColorChange = (
    category: keyof typeof categoryColors,
    color: string
  ) => {
    setCategoryColors((prevColors) => ({
      ...prevColors,
      [category]: color,
    }));
  };

  const handlePriorityChange = (idx: number, newPriority: string) => {
    setPriorities((prev) =>
      prev.map((item, index) =>
        index === idx ? { ...item, priority: newPriority } : item
      )
    );
  };

  const handleSelection = (index: number, type: string) => {
    setSelections((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, selected: type } : item
      )
    );
  };

  const handleAddReminder = (categoryIndex: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, idx) =>
        idx === categoryIndex && category.reminders.length < 3
          ? { ...category, reminders: [...category.reminders, "none"] }
          : category
      )
    );
  };

  const handleRemoveReminder = (
    categoryIndex: number,
    reminderIndex: number
  ) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, idx) =>
        idx === categoryIndex
          ? {
              ...category,
              reminders: category.reminders.filter(
                (_, rIdx) => rIdx !== reminderIndex
              ),
            }
          : category
      )
    );
  };

  const handleReminderChange = (
    categoryIndex: number,
    reminderIndex: number,
    value: string
  ) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, idx) =>
        idx === categoryIndex
          ? {
              ...category,
              reminders: category.reminders.map((reminder, rIdx) =>
                rIdx === reminderIndex ? value : reminder
              ),
            }
          : category
      )
    );
  };

  const handleSaveToken = async () => {
    try {
      console.log("Sending mango token:", mangoToken);
      const response = await smCalendar.updateMangoToken(mangoToken);
      console.log("Mango token updated successfully", response);
      await Swal.fire({
        title: "Deleted!",
        text: "The event has been successfully deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating mango token", error);
    }
  };

  const getDeviceName = () => {
    const ua = navigator.userAgent;
    let browser = "Unknown Browser";
    let os = "Unknown OS";

    if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edge") === -1) {
      browser = "Google Chrome";
    } else if (ua.indexOf("Firefox") > -1) {
      browser = "Firefox";
    } else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
      browser = "Safari";
    } else if (ua.indexOf("Edge") > -1) {
      browser = "Edge";
    }

    const platform = navigator.platform;
    if (platform.indexOf("Mac") > -1) {
      os = "Mac";
    } else if (platform.indexOf("Win") > -1) {
      os = "Windows";
    } else if (platform.indexOf("Linux") > -1) {
      os = "Linux";
    }

    return `${browser} on ${os}`;
  };

  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const handleTokenNoti = async () => {
    // ตรวจสอบว่ามี token อยู่แล้วหรือไม่
    if (tokenNoti.length === 0) {
      try {
        const token = await getToken(messaging, {
          vapidKey:
            "BO4_ZrKbkO2ujkenilRZmFvCiHuLCSEkpblXOVfLrud03BILcqsCARMwPGW4HcJqx8mBF5FcwcYyF7HiSocgkos",
        });
        if (token) {
          const payload = {
            token: token,
            deviceName: getDeviceName(),
          };
          console.log("Sending payload to backend:", payload);
          await smCalendar.addFCMToken(payload);
          // หลังจากส่ง token แล้ว คุณอาจจะต้องอัปเดต state tokenNoti ให้มี token นี้ด้วย
          // ตัวอย่าง: setTokenNoti([payload]) หรือ merge กับ tokenNoti เดิม
          setTokenNoti([payload]);
        } else {
          console.log("No registration token available.");
        }
      } catch (err) {
        console.error("Error getting token:", err);
      }
    } else {
      console.log("Token already exists. Skipping API call.");
    }
  };

  const handleToggleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setNotificationEnabled(newValue);

    if (newValue) {
      await handleTokenNoti();
    } else {
      // ถ้าปิด toggle ให้ลบ token ทั้งหมดจาก backend
      try {
        await Promise.all(
          tokenNoti.map((token) => smCalendar.deleteFCMToken(token.id))
        );
        setTokenNoti([]);
      } catch (error) {
        console.error("Error deleting tokens:", error);
      }
    }
  };

  const [tokenNoti, setTokenNoti] = useState<any[]>([]);
  // const [notificationEnabled, setNotificationEnabled] = useState(false);
  useEffect(() => {
    const fetchCalendarFCMToken = async () => {
      try {
        const tokens = await smCalendar.getFCMToken();
        console.log("FCM Tokens from API:", tokens);

        const Groups = await smCalendar.getGroups();
        console.log("FCM Tokens from API:", Groups);

        if (!Array.isArray(tokens)) {
          console.error("Invalid response format:", tokens);
          return;
        }

        setTokenNoti(tokens); // Ensure tokens are correctly formatted
        setNotificationEnabled(tokens.length > 0);
      } catch (error) {
        console.error("Error retrieving FCM Token:", error);
      }
    };

    fetchCalendarFCMToken();
  }, []);

  const handleDeleteToken = async (id?: number) => {
    if (!id) {
      console.error("Invalid token ID:", id);
      return;
    }

    try {
      await smCalendar.deleteFCMToken(id);
      setTokenNoti((prevTokens) => {
        const updatedTokens = prevTokens
          ? prevTokens.filter((token) => token.id !== id)
          : [];
        if (updatedTokens.length === 0) {
          setNotificationEnabled(false);
        }
        return updatedTokens;
      });
    } catch (error) {
      console.error("Error deleting FCM token:", error);
    }
  };

  const items = [
    {
      id: "Mango",
      title: "Access Token",
      summary: "Access Token from Mango",
      renderExpanded: () => (
        <div>
          <div
            style={{
              backgroundColor: "#f9f9fb",
              padding: "16px",
              borderRadius: "15px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              textAlign: "center",
              width: "95%",
              marginTop: "10px",
              position: "relative",
            }}
          >
            <a
              href="https://mango-cmu.instructure.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#5263F3",
                textDecoration: "none",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              Mango-cmu.instructure.com
            </a>
            <Typography
              sx={{
                marginTop: "5px",
                fontSize: "14px",
                color: "#5263F3",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => setIsPopupOpen(true)}
            >
              What is token?
            </Typography>

            <TextField
              fullWidth
              label="Token"
              type="text"
              variant="outlined"
              margin="normal"
              value={mangoToken}
              onChange={(e) => setMangoToken(e.target.value)}
              InputProps={{
                style: {
                  backgroundColor: "#fff",
                  borderRadius: "30px",
                  border: "none",
                  outline: "none",
                },
                disableUnderline: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
            />

            <div
              style={{
                textAlign: "right",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={handleSaveToken}
                variant="outlined"
                sx={{
                  color: "#8576FF",
                  borderColor: "#8576FF",
                  borderRadius: "20px",
                  fontSize: "13px",
                  "&:hover": {
                    backgroundColor: "#8576FF",
                    color: "#ffffff",
                  },
                }}
              >
                Save
              </Button>
            </div>
          </div>

          <AccessTokenPopup
            open={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
          />
        </div>
      ),
    },
    {
      id: "notificationSettings",
      title: "Notification",
      summary: "Enable or disable notifications",
      renderExpanded: () => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "16px",
            backgroundColor: "#fff",
            borderRadius: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography>Notifications</Typography>
            <Switch
              checked={notificationEnabled}
              onChange={handleToggleChange}
              color="primary"
            />
          </div>
          {notificationEnabled && tokenNoti && tokenNoti.length > 0 ? (
            tokenNoti.map((token, index) => (
              <div
                key={token.id || index} // ✅ Use token.id if available, otherwise fallback to index
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "10px",
                    backgroundColor: "#f9f9fb",
                    padding: "16px",
                    borderRadius: "15px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    maxWidth: "1000px",
                    width: "100%",
                  }}
                >
                  <Typography variant="body2">
                    Token: {token.deviceName}
                  </Typography>
                  <IconButton
                    onClick={() => handleDeleteToken(token.id)}
                    size="small"
                    sx={{ color: "#ff0000" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))
          ) : (
            <Typography variant="body2" style={{ marginTop: "8px" }}>
              No notification available
            </Typography>
          )}
        </div>
      ),
    },
    {
      id: "Categorycolors",
      title: "Category colors",
      summary: "Define colors for categories",
      renderExpanded: () => (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              width: "100%",
            }}
          >
            {(
              Object.keys(categoryColors) as Array<keyof typeof categoryColors>
            ).map((category) => (
              <div
                key={category}
                style={{
                  backgroundColor: "#f9f9fb",
                  borderRadius: "15px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "10px",
                  textAlign: "center",
                  position: "relative",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100px",
                    borderRadius: "8px",
                    backgroundColor: categoryColors[category],
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setActiveColorPicker(
                      activeColorPicker === category ? null : category
                    )
                  }
                ></div>

                <p
                  style={{
                    margin: "4px 0",
                    fontSize: "16px",
                    fontWeight: "300",
                  }}
                >
                  {category
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </p>
                {activeColorPicker === category && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "8px",
                      gap: "8px",
                    }}
                  >
                    {predefinedColors.map((color) => (
                      <div
                        key={color}
                        onClick={() => handleColorChange(category, color)}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          cursor: "pointer",
                          border:
                            categoryColors[category] === color
                              ? "1px solid black"
                              : "1px solid lightgray",
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <Button
              onClick={() => {
                console.log("Saved category colors", categoryColors);
              }}
              variant="outlined"
              sx={{
                color: "#8576FF",
                borderColor: "#8576FF",
                borderRadius: "20px",
                fontSize: "13px",
                "&:hover": {
                  backgroundColor: "#8576FF",
                  color: "#ffffff",
                },
              }}
            >
              Save
            </Button>
          </div>
        </div>
      ),
    },

    {
      id: "AvailabilitySettings",
      title: "Availability Settings",
      summary: "Mark each category as 'Busy' or 'Free'",
      renderExpanded: () => (
        <div>
          <div
            style={{
              marginTop: "10px",
              backgroundColor: "#f9f9fb",
              padding: "16px",
              borderRadius: "15px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <span></span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                Busy
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                Free
              </span>
            </div>

            {selections.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "300",
                    textAlign: "left",
                  }}
                >
                  {item.label}
                </span>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    margin: "0 auto",
                    backgroundColor:
                      item.selected === "busy" ? "#8576FF" : "lightgray",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelection(idx, "busy")}
                ></div>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    margin: "0 auto",
                    backgroundColor:
                      item.selected === "free" ? "#8576FF" : "lightgray",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelection(idx, "free")}
                ></div>
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <Button
              onClick={() => {
                console.log("Saved availability settings", selections);
              }}
              variant="outlined"
              sx={{
                color: "#8576FF",
                borderColor: "#8576FF",
                fontSize: "13px",
                borderRadius: "20px",
                "&:hover": {
                  backgroundColor: "#8576FF",
                  color: "#ffffff",
                },
              }}
            >
              Save
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "prioritySettings",
      title: "Priority Settings",
      summary: "Set priority for each item",
      renderExpanded: () => (
        <div>
          <div
            style={{
              marginTop: "10px",
              backgroundColor: "#f9f9fb",
              padding: "16px",
              borderRadius: "15px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {priorities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "300",
                    textAlign: "left",
                  }}
                >
                  {item.label}
                </span>
                <select
                  value={item.priority}
                  onChange={(e) => handlePriorityChange(idx, e.target.value)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #8576FF",
                    cursor: "pointer",
                    background: "transparent",
                    fontSize: "14px",
                    fontWeight: "300",
                    color: "#8576FF",
                  }}
                >
                  <option value="Low Priority">Low Priority</option>
                  <option value="Medium Priority">Medium Priority</option>
                  <option value="High Priority">High Priority</option>
                </select>
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <Button
              onClick={() => {
                console.log("Saved priority settings", priorities);
              }}
              variant="outlined"
              sx={{
                color: "#8576FF",
                borderRadius: "20px",
                borderColor: "#8576FF",
                fontSize: "13px",
                "&:hover": {
                  backgroundColor: "#8576FF",
                  color: "#ffffff",
                },
              }}
            >
              Save
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "reminderSettings",
      title: "Reminder Settings",
      summary: "Set reminders for your events",
      renderExpanded: () => {
        return (
          <>
            <div
              style={{
                marginTop: "10px",
                backgroundColor: "#f9f9fb",
                padding: "16px",
                borderRadius: "15px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {categories.map((category, categoryIndex) => (
                <React.Fragment key={category.label}>
                  <div
                    key={category.label}
                    style={{
                      marginBottom: "16px",
                    }}
                  >
                    {/* Label และ Select แรก */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "300",
                          margin: 0,
                        }}
                      >
                        {category.label}
                      </p>
                      {/* Select แรก พร้อมปุ่ม ✕ */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          width: "47%",
                        }}
                      >
                        <select
                          value={category.reminders[0]}
                          onChange={(e) =>
                            handleReminderChange(
                              categoryIndex,
                              0,
                              e.target.value
                            )
                          }
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid #8576FF",
                            fontSize: "14px",
                            cursor: "pointer",
                            background: "white",
                            width: "100%",
                            color: "#8576FF",
                          }}
                        >
                          <option value="none" hidden>
                            Select Reminder Time
                          </option>
                          <option value="atStart">At time event</option>
                          <option value="5min">5 min before</option>
                          <option value="10min">10 min before</option>
                          <option value="15min">15 min before</option>
                          <option value="30min">30 min before</option>
                          <option value="1hour">1 hour before</option>
                          <option value="2hour">2 hour before</option>
                          <option value="1day">1 day before</option>
                          <option value="2day">2 day before</option>
                          <option value="1week">1 week before</option>
                        </select>
                        {/* ปุ่ม ✕ สำหรับ Select แรก */}
                        {category.reminders.length > 1 && (
                          <button
                            onClick={() =>
                              handleRemoveReminder(categoryIndex, 0)
                            }
                            style={{
                              marginLeft: "10px",
                              color: "red",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Select ที่เหลือ */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "8px",
                      }}
                    >
                      {category.reminders
                        .slice(1)
                        .map((reminder, reminderIndex) => (
                          <div
                            key={reminderIndex + 1}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              width: "100%",
                            }}
                          >
                            <select
                              value={reminder}
                              onChange={(e) =>
                                handleReminderChange(
                                  categoryIndex,
                                  reminderIndex + 1,
                                  e.target.value
                                )
                              }
                              style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: "1px solid #8576FF",
                                fontSize: "14px",
                                cursor: "pointer",
                                background: "white",
                                width: "40%",
                                color: "#8576FF",
                              }}
                            >
                              <option value="none" hidden>
                                Select Reminder Time
                              </option>
                              <option value="none">none</option>
                              <option value="atStart">At time event</option>
                              <option value="5min">5 min before</option>
                              <option value="10min">10 min before</option>
                              <option value="15min">15 min before</option>
                              <option value="30min">30 min before</option>
                              <option value="1hour">1 hour before</option>
                              <option value="2hour">2 hour before</option>
                              <option value="1day">1 day before</option>
                              <option value="2day">2 day before</option>
                              <option value="1week">1 week before</option>
                            </select>
                            {/* ปุ่ม ✕ สำหรับ Select อื่นๆ */}
                            <button
                              onClick={() =>
                                handleRemoveReminder(
                                  categoryIndex,
                                  reminderIndex + 1
                                )
                              }
                              style={{
                                marginLeft: "10px",
                                color: "red",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      {category.reminders.length < 3 && (
                        <button
                          onClick={() => handleAddReminder(categoryIndex)}
                          style={{
                            padding: "6px 6px",
                            fontSize: "14px",
                            fontWeight: "300",
                            background: "#f9f9fb",
                            color: "#000",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          + Add Reminder
                        </button>
                      )}
                    </div>
                  </div>
                  {categoryIndex < categories.length - 1 && (
                    <Divider
                      style={{
                        margin: "16px 0",
                        borderColor: "#e0e0e0",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <Button
                onClick={() => {
                  console.log("Saved reminder settings", categories);
                }}
                variant="outlined"
                sx={{
                  color: "#8576FF",
                  borderColor: "#8576FF",
                  borderRadius: "20px",
                  fontSize: "13px",
                  "&:hover": {
                    backgroundColor: "#8576FF",
                    color: "#ffffff",
                  },
                }}
              >
                Save
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#fff",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          marginTop: "10px",
          marginBottom: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 270px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "34px",
            fontWeight: 300,
          }}
        >
          Setting
        </h2>
      </div>

      <Divider sx={{ borderColor: "#e5e5e5", mb: 2 }} />
      <div
        style={{
          display: "flex",
          flex: 1,
          overflowY: "auto",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            width: "100%",
            overflowY: "auto",
            maxHeight: "80vh",
            paddingBottom: "16px",
          }}
        >
          {items.map((item) => {
            const isOpen = openItem === item.id;
            return (
              <div
                key={item.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "16px 0",
                  cursor: "pointer",
                }}
              >
                {isOpen ? (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        gap: "16px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "22px",
                          fontWeight: "500",
                        }}
                      >
                        {item.title}
                      </h3>
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "20px",
                          color: "#999",
                        }}
                        onClick={() => setOpenItem(null)}
                      >
                        ✕
                      </span>
                    </div>
                    {item.renderExpanded()}
                  </div>
                ) : (
                  <div onClick={() => setOpenItem(item.id)}>
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {item.summary}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </Box>
      </div>
    </div>
  );
};

export default Settings;
