import React from "react";
import { observer } from "mobx-react";
import { UploadFile } from "antd/lib/upload/interface";
import { AliyunOSSUpload, AliyunOSSUploadProps } from './AliyunOSSUpload';
export * from "antd/lib/upload/interface";

interface Props extends Omit<AliyunOSSUploadProps, 'onChange' | 'defaultFileList'> {
  value?: Array<UploadFile>;
  onChange?: (value: Array<UploadFile>) => any;
}

const FormAliyunOSSUpload: React.FunctionComponent<Props> = observer(({ 
  value = [],
  onChange = () => {},
  children,
  ...uploadProps
}) => {

  return (
    <AliyunOSSUpload
      defaultFileList={value}
      onChange={(info) => onChange(info.fileList)}
      {...uploadProps}
    >
      {children}
    </AliyunOSSUpload>
  )
})

export { FormAliyunOSSUpload }