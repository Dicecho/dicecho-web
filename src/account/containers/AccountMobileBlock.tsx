import React from "react";
import { observer } from "mobx-react";
import AuthStore from '@/shared/stores/AuthStore';
import { Card } from 'antd';
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import ProfileEditForm from '@/account/components/ProfileEditForm';
import { HeaderLayout, HeaderBack } from "@/shared/components/Header";
import ScrollToTop from "@/shared/components/ScrollToTop";
import AccountBlock from './AccountBlock';

interface IProps {}

const AccountMobileBlock: React.FC<IProps> = observer((props) => {

  return (
    <React.Fragment>
      <ScrollToTop />
      <CustomizedHeader>
        <HeaderLayout left={<HeaderBack />} title="屏蔽设置" />
      </CustomizedHeader>
      <AccountBlock />
    </React.Fragment>
  );
});
export default AccountMobileBlock;
