import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { PlusOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib/upload/interface";
import { AliyunOSSUpload, AliyunOSSUploadProps } from './AliyunOSSUpload';
export * from "antd/lib/upload/interface";

interface Props extends Omit<AliyunOSSUploadProps, 'onChange'> {
  value?: Array<string>;
  onChange?: (value: Array<string>) => any;
  multipleLimit?: number;
}

const FormImageUploader: React.FunctionComponent<Props> = observer(({ 
  value = [],
  onChange = () => {},
  multiple = true,
  multipleLimit = 8,
  ...uploadProps
}) => {
  const [innerValue, setInnerValue] = useState<Array<UploadFile>>(value.map(url => ({ uid: url, size: 0, name: url, type: "", url: url })));

  useEffect(() => {
    onChange(innerValue.map(img => img.url || '').filter((url) => url !== ''))
  }, [innerValue])

  const renderContent = () => {
    if (multiple && innerValue.length < multipleLimit) {
      return (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>添加图片</div>
        </div>
      )
    }

    if (!multiple && (value.length === 0 || value[0] === '')) {
      return (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>添加图片</div>
        </div>
      )
    }

    return null;
  }

  return (
      <AliyunOSSUpload
        listType="picture-card"
        accept=".jpg,.png,.jpeg,.webp,.svg"
        multiple={multiple}
        defaultFileList={innerValue}
        onChange={(info) => setInnerValue(info.fileList)}
        {...uploadProps}
      >
        {renderContent()}
      </AliyunOSSUpload>
  )
})

export { FormImageUploader }