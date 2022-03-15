import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Upload, Spin } from "antd";
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import FileStore from '@/shared/stores/FileStore';
import './style.less'

interface Props {
  defaultImageUrl?: string;
  className?: string;
  onUpload: (url: string) => void;
  usingImgCrop?: boolean;
  ImgCropProps?: ImgCropProps;
}

const ImageUploader: React.FunctionComponent<Props> = observer(({ usingImgCrop = false, ImgCropProps, ...props }) => {
  const [imageChanged, setImageChanged] = useState(false);
  const [imageUrl, setImageUrl] = useState(props.defaultImageUrl || '');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!imageChanged) {
      setImageUrl(props.defaultImageUrl || '')
    }
  }, [props.defaultImageUrl, imageChanged])

  const beforeUpload = (image: Blob) => {
    setUploading(true);
    FileStore.uploadFile(image).then((res) => {
      setImageChanged(true);
      setImageUrl(res.data.url);
      props.onUpload(res.data.url);
    }).finally(() => {
      setUploading(false);
    })

    return false;
  };

  const renderContent = () => {
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className={`image-uploader ${props.className || ''}`}
        accept=".jpg,.png,.jpeg"
        showUploadList={false}
        multiple={false}
        beforeUpload={beforeUpload}
      >
        {uploading
          ? <Spin />
          : <div className="image-uploader-viewer" style={{ backgroundImage: `url(${imageUrl})`}} />
        }
      </Upload>
    )
  }

  if (usingImgCrop) {
    return (
      <ImgCrop rotate modalTitle='编辑图片' {...ImgCropProps}>
        {renderContent()}
      </ImgCrop>
    );
  }

  return (
    <React.Fragment>
      {renderContent()}
    </React.Fragment>
  )

});

export default ImageUploader;
