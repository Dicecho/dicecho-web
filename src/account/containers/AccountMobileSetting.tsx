import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import { HeaderLayout, HeaderBack } from "@/shared/components/Header";
import MobileMenuItem from '@/shared/components/MobileMenuItem';
import ScrollToTop from "@/shared/components/ScrollToTop";
import { RightOutlined } from "@ant-design/icons";


const tabItems = [
  {
    link: "profile",
    title: "修改个人资料",
  },
  {
    link: "avatar",
    title: "设置头像",
  },
  {
    link: "change-password",
    title: "修改密码",
  },
  {
    link: "block",
    title: "屏蔽",
  },
]

interface IProps {}

const AccountMobileSetting: React.FC<IProps> = observer((props) => {
  const history = useHistory();

  return (
    <React.Fragment>
      <ScrollToTop />
      <CustomizedHeader>
        <HeaderLayout 
          left={<HeaderBack />}
          title="个人设置"
        />
      </CustomizedHeader>
      <div className="container">
        {tabItems.map((tab) => (
          <MobileMenuItem 
            key={tab.link}
            onClick={() => history.push(`/account/setting/${tab.link}`)}
            label={tab.title}
            action={<RightOutlined style={{ marginLeft: 'auto' }} />}
          />
        ))}
      </div>
    </React.Fragment>
  );
});
export default AccountMobileSetting;
