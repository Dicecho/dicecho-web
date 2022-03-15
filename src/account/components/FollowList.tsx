import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { List, Spin } from "antd";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import Empty from "@/shared/components/Empty";
import InfiniteScrollWrapper from "@/shared/components/InfiniteScrollWrapper";
import FollowItem from "./FollowItem";
import styles from "./FollowList.module.less";
import AccountStore, { IAccountDto } from "../stores/AccountStore";

interface IProps {
  user: IAccountDto;
  type: "follower" | "following";
}

const FollowList: React.FC<IProps> = observer(({ user, type }) => {
  const fetchApi =
    type === "follower"
      ? AccountStore.fetchFollowers
      : AccountStore.fetchFollowings;

  return (
    <InfiniteScrollWrapper<IAccountDto>
      fetchApi={(query) => fetchApi(user._id, query).then((res) => res.data)}
      empty={(
        <Empty emptyImageUrl={notAuthSVG} emptyText={"没有更多关注人了"} />
      )}
      renderList={(data) => (
        <List
          dataSource={data}
          renderItem={(item) => <FollowItem user={item} />}
        />
      )}
    />
  )
});
export default FollowList;
