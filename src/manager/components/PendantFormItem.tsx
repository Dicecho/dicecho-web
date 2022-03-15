
import React, { Component, useState } from 'react';
import { Avatar } from "antd";
import { OSSUpload } from "@/shared/components/Uploader";
import { Pendant } from "@/shared/components/Pendant";

interface IProps {
  value?: string;
  onChange?: (url: string) => any;
  previewAvatar?: string;
}
export const PendantFormItem: React.FC<IProps> = ({
  value = '',
  previewAvatar = '/avatars/preview',
  onChange = () => {},
  ...props
}) => {

  return (
    <OSSUpload 
      accept=".jpg,.png,.jpeg,.gif,.svg"
      showUploadList={false}
      multiple={false}
      onUploaded={(url) => {
        if (!url) return;
        onChange(url);
      }}
      rename
    >
      <Pendant url={value}>
          <Avatar 
            src={previewAvatar}
            style={{ cursor: 'pointer' }}
            size={64}
          />
      </Pendant>
    </OSSUpload>
  )
}

