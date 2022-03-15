import { action, observable } from "mobx";
import BaseProvider from "@/utils/BaseProvider";
import moment from 'moment';
import OSS from 'ali-oss';

export interface AssumeRoleResponse {
  SecurityToken: string,
  AccessKeyId: string,
  AccessKeySecret: string,
  Expiration: string,
  Domain: string,
  Path: string,
  Secure: boolean,
  Bucket: string,
  Region: string,
}

interface IUploadToOssOptions extends OSS.MultipartUploadOptions {
  rename?: boolean
}

class FileStore {
  @observable ossClient?: OSS;
  @observable token?: AssumeRoleResponse;


  getUrlExtension = (url: string) => {
    const result = url.split(/[#?]/)[0].split('.').pop()
    if (!result) {
      throw new Error('传入了非法的url')
    }

    return result.trim();
  }

  @action
  uploadFileToAliOSS = async (file: File, config: IUploadToOssOptions) => {
    const { rename, ...options } = config
    const tokenRes = await this.assumeRole();
    const token = tokenRes.data;
    const client = new OSS({
      region: token.Region,
      accessKeyId: token.AccessKeyId,
      accessKeySecret: token.AccessKeySecret,
      bucket: token.Bucket,
      stsToken: token.SecurityToken,
    })

    const fileName = (() => {
      if (!rename) {
        return file.name
      }

      const extension = this.getUrlExtension(file.name);
      return `${moment().format('YYYYMMDDHHmmss')}${Math.floor(Math.random() * 100)}.${extension}`
    })()

    const filePath = `${token.Path}/${fileName}`;

    return client.multipartUpload(
      filePath,
      file,
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
  };

  @action
  uploadFile = (file: Blob) => {
    const formData = new FormData();
    formData.append('file', file);
  
    return BaseProvider.post<{url: string}>(`/api/file/upload/`, formData)
  };

  @action
  assumeRole = () => {
    return BaseProvider.get<AssumeRoleResponse>(`/api/file/assume/`)
  }

  @action
  getAndRefreshClient = async () => {
    const tokenRes = await this.assumeRole()
    const token = tokenRes.data;
    
    const client = new OSS({
      region: token.Region,
      accessKeyId: token.AccessKeyId,
      accessKeySecret: token.AccessKeySecret,
      bucket: token.Bucket,
      stsToken: token.SecurityToken,
    })

    this.ossClient = client;
    this.token = token;

    return {
      client,
      token,
    }
  }

  @action 
  getOssClient = async () => {
    if (!this.ossClient || !this.token) {
      return this.getAndRefreshClient();
    }

    if (new Date(this.token.Expiration).getTime() < new Date().getTime()) {
      return this.getAndRefreshClient();
    }

    return {
      client: this.ossClient,
      token: this.token,
    }
  }

}

const store = new FileStore();

export default store;
