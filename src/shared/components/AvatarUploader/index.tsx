import React from 'react';
import { observer } from 'mobx-react';
import { Upload, message, Spin } from 'antd';
import {
  AliyunOSSUpload,
  UploadFile,
} from "@/shared/components/Uploader";
import { UserOutlined } from "@ant-design/icons";
import AuthStore from '@/shared/stores/AuthStore';
import FileStore from '@/shared/stores/FileStore';
import './Avatar.less';

@observer
class AvatarUploader extends React.Component<any, {
  isUploading: boolean,
  isEditing: boolean,
  avatar: Blob | null,
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      isUploading: false,
      isEditing: false,
      avatar: null,
    };
  }

  beforeUpload = (avatar: Blob) => {
    this.setState({
      isUploading: true,
    });

    FileStore.uploadFile(avatar).then((res) => {
      AuthStore.updateProfile({
        avatarUrl: res.data.url,
      }).then(() => {
        message.success('头像修改成功')
      }).catch((err) => {
        console.log(err)
        message.error('头像修改失败，请重试')
      }).finally(() => {
        this.setState({ isUploading: false });
      });
    })

    return false;
  }

  render() {
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className={`avatar-uploader ${this.props.className}`}
        style={this.props.style}
        accept=".jpg,.png,.jpeg,.gif"
        showUploadList={false}
        multiple={false}
        beforeUpload={this.beforeUpload}
      >
        <div className="avatar-img" style={{backgroundImage: `url(${AuthStore.user.avatarUrl})`}}>
          <div
            className="avatar-layer"
            style={(this.state.isUploading) ? { opacity:  1 } : {}}
          >
            {this.state.isUploading ?
              <Spin className="loading-icon"/> :
              <span><UserOutlined />上传头像</span>
            }
          </div>
        </div>
      </Upload>
    );
  }
}

export default AvatarUploader;
