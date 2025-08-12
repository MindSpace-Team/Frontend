import React from 'react';

interface ViewBoxContextType {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ViewBoxContext = React.createContext<ViewBoxContextType | undefined>(undefined);
