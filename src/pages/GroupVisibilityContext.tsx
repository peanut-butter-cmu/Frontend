import { createContext, useContext, useState, ReactNode } from "react";

interface GroupVisibilityContextProps {
  groupVisibility: { [key: string]: boolean };
  subjectVisibility: { [subjectId: string]: boolean };
  collabVisibility: { [key: string]: boolean };
  toggleGroupVisibility: (groupId: string) => void;
  toggleSubjectVisibility: (subjectId: string) => void;
  toggleCollabVisibility: (collabId: string) => void;
}

const GroupVisibilityContext = createContext<
  GroupVisibilityContextProps | undefined
>(undefined);

export const GroupVisibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [groupVisibility, setGroupVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [subjectVisibility, setSubjectVisibility] = useState<{
    [subjectId: string]: boolean;
  }>({});
  const [collabVisibility, setCollabVisibility] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleGroupVisibility = (groupId: string) => {
    setGroupVisibility((prev) => ({
      ...prev,
      [groupId]: prev[groupId] === false ? true : false,
    }));
  };

  const toggleSubjectVisibility = (subjectId: string) => {
    setSubjectVisibility((prev) => ({
      ...prev,
      [subjectId]: prev[subjectId] === false ? true : false,
    }));
  };

  const toggleCollabVisibility = (collabId: string) => {
    setCollabVisibility((prev) => ({
      ...prev,
      [collabId]: prev[collabId] === false ? true : false,
    }));
  };

  return (
    <GroupVisibilityContext.Provider
      value={{
        groupVisibility,
        subjectVisibility,
        collabVisibility,
        toggleGroupVisibility,
        toggleSubjectVisibility,
        toggleCollabVisibility,
      }}
    >
      {children}
    </GroupVisibilityContext.Provider>
  );
};

export const useGroupVisibility = () => {
  const context = useContext(GroupVisibilityContext);
  if (!context) {
    throw new Error(
      "useGroupVisibility must be used within a GroupVisibilityProvider"
    );
  }
  return context;
};