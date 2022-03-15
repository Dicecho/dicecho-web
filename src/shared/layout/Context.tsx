
import React, { createContext } from 'react';

export interface HeaderOptions {
  title: () => React.ReactNode;
  left: () => React.ReactNode;
  right: () => React.ReactNode;
  transparent: boolean;
  visible: boolean;
}

export const HeaderContext = createContext<{
  headerOptions: Partial<HeaderOptions>;
  setHeaderOptions: (value: Partial<HeaderOptions>) => any;
}>({
  headerOptions: {},
  setHeaderOptions: () => {},
})
