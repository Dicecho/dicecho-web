import React, { HTMLAttributes } from "react";
import styles from "./styles.module.less";


interface IProps extends HTMLAttributes<HTMLDivElement> {
  to?: string;
  label: string;
  action?: React.ReactNode
}

const MobileMenuItem: React.FC<IProps> = ({
  label,
  action,
  ...props
}) => {

  return (
    <div className={styles.mobileMenuItem} {...props}>
      {label}
      <div style={{ marginLeft: "auto" }}>
        {action}
      </div>
    </div>
  );

};

export default MobileMenuItem;
