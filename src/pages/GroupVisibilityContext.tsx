import { createContext, useContext, useState, ReactNode } from "react";

interface GroupVisibilityContextProps {
  groupVisibility: { [key: string]: boolean };
  subjectVisibility: { [subjectId: string]: boolean };
  toggleGroupVisibility: (group: string) => void;
  toggleSubjectVisibility: (subjectId: string) => void;
}

const GroupVisibilityContext = createContext<GroupVisibilityContextProps | undefined>(undefined);

export const GroupVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const initialGroupVisibility: { [key: string]: boolean } = {
    CMU: true,
    Class: true,
    Quiz: true,
    Assignment: true,
    Final: true,
    Midterm: true,
    Holiday: true,
    Owner: true,
  };

  // subjectVisibility is initially an empty object.
  // (When rendering subjects, if a key isn’t defined, you can assume true.)
  const [groupVisibility, setGroupVisibility] = useState<{ [key: string]: boolean }>(initialGroupVisibility);
  const [subjectVisibility, setSubjectVisibility] = useState<{ [subjectId: string]: boolean }>({});

//   console.log("subjectVisibility:", subjectVisibility);
// console.log("groupVisibility:", groupVisibility);
  const toggleGroupVisibility = (group: string) => {
    setGroupVisibility((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleSubjectVisibility = (subjectId: string) => {
    setSubjectVisibility((prev) => ({
      ...prev,
      // If undefined (or true) then toggle to false, and vice versa.
      [subjectId]: prev[subjectId] === false ? true : false,
    }));
  };
  

  return (
    <GroupVisibilityContext.Provider
      value={{
        groupVisibility,
        subjectVisibility,
        toggleGroupVisibility,
        toggleSubjectVisibility,
      }}
    >
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
