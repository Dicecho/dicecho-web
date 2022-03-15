import Compressor from 'compressorjs';
import FileStore from '@/shared/stores/FileStore';
import moment from 'moment';
import OSS from 'ali-oss';
export * from "antd/lib/upload/interface";

interface IOploadOptions {
  rename: boolean,
  compress: boolean,
  compressorOption: Omit<Compressor.Options, 'success'>,
}

async function compressFile(file: File, option: Partial<Omit<Compressor.Options, 'success' | 'error'>>) {
  return new Promise((resolve: (file: File) => any, reject) => {
    new Compressor(file, {
      ...option,
      success: resolve,
      error: reject,
    });
  });
}

const getUrlExtension = (url: string) => {
  const result = url.split(/[#?]/)[0].split('.').pop()
  if (!result) {
    throw new Error('传入了非法的url')
  }

  return result.trim();
}

export function useUploadOSS(props: Partial<IOploadOptions> = {}) {
  const upload = async (file: File, options: OSS.MultipartUploadOptions = {}) => {
    const { client, token } = await FileStore.getOssClient();

    const fileName = (() => {
      if (props.rename) {
        const extension = getUrlExtension(file.name);
        return `${moment().format('YYYYMMDDHHmmss')}${Math.floor(Math.random() * 100)}.${extension}`
      }

      return file.name
    })()

    const nFile = await (async () => {
      if (props.compress) {
        return compressFile(file, props.compressorOption || {})
      }
      return file
    })()

    const filePath = `${token.Path}/${fileName}`;

    return client.multipartUpload(
      filePath,
      nFile,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        ...options
      },
    ).then((res) => {
      return {
        url: `${token.Secure ? 'https' : 'http'}://${token.Domain}/${filePath}`,
        ...res,
      }
    })
  }

  return {
    upload
  }
}
