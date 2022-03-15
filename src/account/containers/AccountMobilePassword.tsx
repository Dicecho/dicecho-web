import React from "react";
import { observer } from "mobx-react";
import AuthStore from '@/shared/stores/AuthStore';
import { Card, message } from 'antd';
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import ChangePasswordForm from '@/account/components/ChangePasswordForm';
import { HeaderLayout, HeaderBack } from "@/shared/components/Header";
import ScrollToTop from "@/shared/components/ScrollToTop";

interface IProps {}

const AccountMobilePassword: React.FC<IProps> = observer((props) => {

  return (
    <React.Fragment>
      <ScrollToTop />
      <CustomizedHeader>
        <HeaderLayout left={<HeaderBack />} title="修改密码" />
      </CustomizedHeader>
      <Card bordered={false}>
        <ChangePasswordForm 
          onSubmit={(dto) => AuthStore.changePassword(dto).then(() => message.success('修改成功'))}
        />
      </Card>
    </React.Fragment>
  );
});
export default AccountMobilePassword;
