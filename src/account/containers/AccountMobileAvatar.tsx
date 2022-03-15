import React from "react";
import { observer } from "mobx-react";
import { Card } from 'antd';
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import AccountAvatar from '@/account/components/AccountAvatar';
import { HeaderLayout, HeaderBack } from "@/shared/components/Header";
import ScrollToTop from "@/shared/components/ScrollToTop";

interface IProps {}

const AccountMobileAvatar: React.FC<IProps> = observer((props) => {

  return (
    <React.Fragment>
      <ScrollToTop />
      <CustomizedHeader>
        <HeaderLayout left={<HeaderBack />} title="修改头像" />
      </CustomizedHeader>
      <Card bordered={false}>
        <AccountAvatar />
      </Card>
    </React.Fragment>
  );
});
export default AccountMobileAvatar;
