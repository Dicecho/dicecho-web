import React, { HTMLAttributes, HtmlHTMLAttributes, useState } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import { LeftOutlined } from "@ant-design/icons";
import styles from "./styles.module.less";

interface IProps extends HTMLAttributes<HTMLDivElement> {
}

const HeaderBack: React.FC<IProps> = observer(({
  className = '',
  children,
  ...props
}) => {
  const history = useHistory();

  return (
    <div 
      className={`${styles.hedaerBack} ${className}`} 
      {...props} 
      onClick={() => history.length > 1 ? history.goBack() : history.replace('/')}
    >
      {children
        ? children
        : <React.Fragment>
          <LeftOutlined /> 返回
        </React.Fragment>
      }
    </div>
  )
});

export { HeaderBack };
