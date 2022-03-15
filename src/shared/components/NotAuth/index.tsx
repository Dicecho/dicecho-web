import React from "react";
import { observer } from "mobx-react";
import { Button } from "antd";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import Empty from "@/shared/components/Empty";
import UIStore from "@/shared/stores/UIStore";

interface IProps {}

const NotAuth: React.FunctionComponent<IProps> = observer((props) => {
  return (
    <Empty
      emptyImageUrl={notAuthSVG}
      emptyText={"看起来您好像没有登录，请登录后再试试吧！"}
    >
      <Button type="primary" onClick={() => UIStore.openLoginModal()}>
        登录！
      </Button>
      <Button
        type="primary"
        onClick={() => UIStore.openLoginModal()}
        style={{ marginTop: 16 }}
      >
        获得账号！
      </Button>
    </Empty>
  );
});

export default NotAuth;
