"use client"

import React, { createContext, useState, ReactNode, useContext } from "react";

interface RefreshContextType {
  refreshFlag: boolean;
  toggleRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const toggleRefresh = () => {
    setRefreshFlag(prev => !prev);
  };

  return (
    <RefreshContext.Provider value={{ refreshFlag, toggleRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = (): RefreshContextType => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefresh must be used within a RefreshProvider");
  }
  return context;
};
