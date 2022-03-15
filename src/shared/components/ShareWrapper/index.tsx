import React, { HTMLAttributes } from "react";
import CopyToClipboard from 'react-copy-to-clipboard';
import { message } from "antd";

interface IProps {
  url?: string;
  // tag?: string;
}

const ShareWrapper: React.FunctionComponent<IProps> = ({
  url = window.location.href,
  children,
  // tag = 'span',
  // ...wrapperProps
}) => {
  return (
    <CopyToClipboard text={url} onCopy={() => message.success('链接复制到剪贴板成功')}>
      {children}
    </CopyToClipboard>
  )
};

export { ShareWrapper }
export default ShareWrapper;
