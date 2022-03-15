import React from "react";
import { observer } from "mobx-react";
import AuthStore from '@/shared/stores/AuthStore';
import { Card } from 'antd';
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import ProfileEditForm from '@/account/components/ProfileEditForm';
import { HeaderLayout, HeaderBack } from "@/shared/components/Header";
import ScrollToTop from "@/shared/components/ScrollToTop";

interface IProps {}

const AccountMobileProfile: React.FC<IProps> = observer((props) => {

  return (
    <React.Fragment>
      <ScrollToTop />
      <CustomizedHeader>
        <HeaderLayout left={<HeaderBack />} title="修改个人资料" />
      </CustomizedHeader>
      <Card bordered={false}>
        <ProfileEditForm
          profile={AuthStore.user}
          onSave={(dto) => AuthStore.updateProfile(dto)}
        />
      </Card>
    </React.Fragment>
  );
});
export default AccountMobileProfile;
