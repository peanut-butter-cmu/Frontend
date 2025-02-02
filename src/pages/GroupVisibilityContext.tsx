import { createContext, useContext, useState, ReactNode } from "react";

interface GroupVisibilityContextProps {
  groupVisibility: { [key: string]: boolean };
  toggleGroupVisibility: (group: string) => void;
}

const GroupVisibilityContext = createContext<GroupVisibilityContextProps | undefined>(undefined);

export const GroupVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const initialVisibility: { [key: string]: boolean } = {
    CMU: true,
    Class: true,
    Quiz: true,
    Assignment: true,
    Final: true,
    Midterm: true,
    Holiday: true,
    Owner: true,
  };

  const [groupVisibility, setGroupVisibility] = useState<{ [key: string]: boolean }>(initialVisibility);

  const toggleGroupVisibility = (group: string) => {
    setGroupVisibility((prev) => ({ ...prev, [group]: !prev[group] }));
  };

console.log("LeftSide groupVisibility:", groupVisibility);
console.log("CalendarPage groupVisibility:", groupVisibility);

  return (
    <GroupVisibilityContext.Provider value={{ groupVisibility, toggleGroupVisibility }}>
      {children}
    </GroupVisibilityContext.Provider>
  );
};

export const useGroupVisibility = () => {
  const context = useContext(GroupVisibilityContext);
  if (!context) {
    throw new Error("useGroupVisibility must be used within a GroupVisibilityProvider");
  }
  return context;
};
