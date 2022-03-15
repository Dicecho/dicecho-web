import React from "react";
import { Layout } from 'antd';
import { observer } from "mobx-react";
import "./styles.less"

interface IProps {
  className?: string,
}

const PageHeader: React.FunctionComponent<IProps> = observer((props) => {
  return (
    <div className={`page-header ${props.className || ''}`}>
      {props.children}
    </div>
  );
});

export default PageHeader;
