import React, { useState } from "react";
import Divider from "@mui/material/Divider";

const SchedulingSettings: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [categoryColors, setCategoryColors] = useState<Record<'CMU' | 'Class' | 'Assignment' | 'Quiz' | 'Exam' | 'Owner', string>>({
    CMU: "#615EFC",
    Class: "#41B3A2",
    Assignment: "#FCCD2A",
    Quiz: "#FF9100",
    Exam: "#FF0000",
    Owner: "#9A7E6F",
  });
  
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const predefinedColors = ["#615EFC", "#41B3A2", "#FCCD2A", "#FF9100", "#FF0000", "#9A7E6F"];

  const handleColorChange = (category: keyof typeof categoryColors, color: string) => {
    setCategoryColors((prevColors) => ({
      ...prevColors,
      [category]: color,
    }));
  };
  

  const [priorities, setPriorities] = useState([
    { label: "CMU", priority: "Low Priority" },
    { label: "Class", priority: "Medium Priority" },
    { label: "Assignment", priority: "High Priority" },
    { label: "Quiz", priority: "High Priority" },
    { label: "Exam", priority: "High Priority" },
  ]);

  const handlePriorityChange = (idx: number, newPriority: string) => {
    setPriorities((prev) =>
      prev.map((item, index) =>
        index === idx ? { ...item, priority: newPriority } : item
      )
    );
  };

  const [selections, setSelections] = useState<
  { label: string; selected: string | null }[]
>([
  { label: "CMU", selected: "free" },
  { label: "Class", selected: "busy" },
  { label: "Assignment", selected: "free" },
  { label: "Quiz", selected: "none" },
  { label: "Exam", selected: "none" },
].map((item) => ({ ...item, selected: null })));


  const handleSelection = (index: number, type: string) => {
    setSelections((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, selected: type } : item
      )
    );
  };
  
  

    const [categories, setCategories] = useState([
      { label: "CMU", reminders: ["none"] },
      { label: "Class", reminders: ["atStart"] },
      { label: "Assignment", reminders: ["1hour"] },
      { label: "Quiz", reminders: ["2hour"] },
      { label: "Exam", reminders: ["1day"] },

    ]);
  
    const handleAddReminder = (categoryIndex: number) => {
      setCategories((prevCategories) =>
        prevCategories.map((category, idx) =>
          idx === categoryIndex && category.reminders.length < 3
            ? { ...category, reminders: [...category.reminders, "none"] }
            : category
        )
      );
    };
  
    const handleRemoveReminder = (categoryIndex: number, reminderIndex: number) => {
      setCategories((prevCategories) =>
        prevCategories.map((category, idx) =>
          idx === categoryIndex
            ? {
                ...category,
                reminders: category.reminders.filter((_, rIdx) => rIdx !== reminderIndex),
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
  
  const items = [
    {
      id: "Categorycolors",
      title: "Category colors",
      summary: "Define colors for categories",
      renderExpanded: () => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            width: "100%",
          }}
        >{(Object.keys(categoryColors) as Array<keyof typeof categoryColors>).map((category) => (
            <div
              key={category}
              style={{
                backgroundColor: "#fff",
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
      ),
    },
    {
      id: "AvailabilitySettings",
      title: "Availability Settings",
      summary: "Mark each category as 'Busy' or 'Free'",
      renderExpanded: () => (
        <div
          style={{
            marginTop: "15px",
            backgroundColor: "#fefefe",
            padding: "16px",
            borderRadius: "6px",
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
                  backgroundColor: item.selected === "busy" ? "#8576FF" : "lightgray",
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
                  backgroundColor: item.selected === "free" ? "#8576FF" : "lightgray",
                  cursor: "pointer",
                }}
                onClick={() => handleSelection(idx, "free")}
              ></div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "prioritySettings",
      title: "Priority Settings",
      summary: "Set priority for each item",
      renderExpanded: () => (
        <div
          style={{
            marginTop: "8px",
            backgroundColor: "#fefefe",
            padding: "16px",
            borderRadius: "6px",
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
      ),
    },
    {
      id: "reminderSettings",
      title: "Reminder Settings",
      summary: "Set reminders for your events",
      renderExpanded: () => {
        return (
          <div
            style={{
              marginTop: "16px",
              backgroundColor: "#fff",
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
                        handleReminderChange(categoryIndex, 0, e.target.value)
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
                    {/* ปุ่ม ✕ สำหรับ Select แรก */}
                    {category.reminders.length > 1 && (
                      <button
                        onClick={() => handleRemoveReminder(categoryIndex, 0)}
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
                  {category.reminders.slice(1).map((reminder, reminderIndex) => (
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
                          handleRemoveReminder(categoryIndex, reminderIndex + 1)
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
                        background: "#fff",
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
        );
      },},
  ];

  return (
    <div
          style={{
            display: "flex",
            backgroundColor: "#f9f9fb",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              marginTop: "10px",
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
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
    padding: "0 320px 32px",
    overflowY: "auto", // ให้ scrollbar แสดงเมื่อเนื้อหาเกิน
    maxHeight: "80vh", // ความสูงสูงสุด
    paddingBottom: "16px", // เพิ่ม padding ด้านล่าง
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
      </div>
    </div>
  );
};

export default SchedulingSettings;
