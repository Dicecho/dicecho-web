import React from "react";
import { Image } from 'antd';
import "./style.less";

interface IProps {
  emptyImageUrl?: string;
  emptyText?: string;
  padding?: number;
}

const Empty: React.FunctionComponent<IProps> = ({
  padding = 16,
  ...props
}) => {

  return (
    <div className="empty-page" style={{ padding }}>
      {props.emptyImageUrl && 
        <Image wrapperClassName="empty-img" preview={false} src={props.emptyImageUrl} width={400} height={200} />
      }
      {props.emptyText &&
        <span className="empty-text">
          {props.emptyText}
        </span>
      }
      <div className="empty-action">
        {props.children}
      </div>
    </div>
  );
};

export default Empty;
export * from './NotFound';