import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Upload, message } from "antd";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import Compressor from 'compressorjs';
import FileStore from '@/shared/stores/FileStore';
import moment from 'moment';
import { useUploadOSS } from '@/shared/hooks';

export * from "antd/lib/upload/interface";

export interface OSSUploadProps extends Omit<UploadProps, 'fileList' | 'beforeUpload' | 'onRemove'> {
  rename?: boolean;
  compress?: boolean;
  compressorOption?: Omit<Compressor.Options, 'success'>;
  onUploaded: (url: string) => any;
}

const OSSUpload: React.FunctionComponent<OSSUploadProps> = observer(({
  children,
  rename = false,
  compress = false,
  compressorOption = { quality: 0.8 },
  onUploaded,
  ...uploadProps
}) => {
  const { upload } = useUploadOSS({ rename, compress, compressorOption });

  const beforeUpload = (file: File) => {
    upload(file).then((res) => {
      onUploaded(res.url);
    });

    return false;
  };

  return (
    <Upload
      beforeUpload={beforeUpload}
      {...uploadProps}
    >
      {children}
    </Upload>
  );
});

export { OSSUpload };
export default OSSUpload;
