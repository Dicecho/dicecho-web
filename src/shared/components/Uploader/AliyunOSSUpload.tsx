import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Upload, message } from "antd";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import Compressor from 'compressorjs';
import FileStore from '@/shared/stores/FileStore';
import moment from 'moment';
export * from "antd/lib/upload/interface";

export interface AliyunOSSUploadProps extends Omit<UploadProps, 'fileList' | 'beforeUpload' | 'onRemove'> {
  rename?: boolean;
  compress?: boolean;
  compressorOption?: Omit<Compressor.Options, 'success'>;
}

async function compressFile(file: File, option: Omit<Compressor.Options, 'success' | 'error'>) {
  return new Promise((resolve: (file: File) => any, reject) => {
    new Compressor(file, {
      ...option,
      success: resolve,
      error: reject,
    });
  });
}

const AliyunOSSUpload: React.FunctionComponent<AliyunOSSUploadProps> = observer(({ 
  defaultFileList,
  onChange,
  children,
  rename = false,
  compress = false,
  compressorOption = { quality: 0.8 },
  ...uploadProps
}) => {
  const [fileList, setFileList] = useState<Array<UploadFile>>(defaultFileList || []);

  useEffect(() => {
    onChange && onChange({
      file: fileList[0],
      fileList,
    })
  }, [fileList])

  const getUrlExtension = (url: string) => {
    const result = url.split(/[#?]/)[0].split('.').pop()
    if (!result) {
      throw new Error('传入了非法的url')
    }

    return result.trim();
  }

  const upload = async (file: File) => {
    const { client, token } = await FileStore.getOssClient();
    const uid = file.name;

    const index = fileList.findIndex(f => f.uid === uid)
    if (index !== -1) {
      message.error('请勿重复上传')
      return false;
    }

    const fileName = (() => {
      if (!rename) {
        return file.name
      }

      const extension = getUrlExtension(file.name);
      return `${moment().format('YYYYMMDDHHmmss')}${Math.floor(Math.random() * 100)}.${extension}`
    })()

    setFileList((prev) => [
      ...prev,
      {
        uid,
        size: file.size,
        name: fileName,
        type: file.type,
        status: 'uploading',
      }
    ])

    let nFile = file;
    if (compress) {
      nFile = await compressFile(file, compressorOption)
    }

    const filePath = `${token.Path}/${fileName}`;

    return client.multipartUpload(
      filePath,
      nFile,
      {
        progress: (percent: number) => {
          setFileList((prev) => {
            const index = prev.findIndex(f => f.uid === uid)
            if (index !== -1) {
              prev[index].percent = percent * 100;
            }
            return [...prev]
          })
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      },
    ).then((result) => {
      setFileList((prev) => {
        const index = prev.findIndex(f => f.uid === uid)
        if (index !== -1) {
          prev[index].response = result.res;
          prev[index].status = 'success';
          prev[index].url = `${token.Secure ? 'https' : 'http'}://${token.Domain}/${filePath}`;
        }
        return [...prev]
      })
    }).catch(async (error) => {
      setFileList((prev) => {
        message.error('上传失败，请重试')
        const index = prev.findIndex(f => f.uid === uid)
        if (index !== -1) {
          prev.splice(index, 1);
        }
        return [...prev]
      })
      console.log(error)
    })
  }

  const beforeUpload = (file: File) => {
    upload(file);

    return false;
  };

  const hadnleRemove = (file: UploadFile) => {
    setFileList((prev) => {
      const index = prev.findIndex(f => f.uid === file.uid)
      if (index !== -1) {
        prev.splice(index, 1)
      }
      return [...prev]
    })
  }

  return (
    <Upload
      fileList={fileList}
      beforeUpload={beforeUpload}
      onRemove={hadnleRemove}
      {...uploadProps}
    >
      {children}
    </Upload>
  );
});

export { AliyunOSSUpload };
export default AliyunOSSUpload;
