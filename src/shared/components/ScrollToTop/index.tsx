import React from 'react';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface IProps {
  pathname?: string;
}

const ScrollToTop: React.FC<IProps> = (props) => {
  const locatuon = useLocation()
  const { pathname = locatuon.pathname } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop