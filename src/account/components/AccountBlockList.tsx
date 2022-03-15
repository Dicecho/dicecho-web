import notAuthSVG from "@/assets/svg/notAuth.svg";
import ModuleWidget from "@/module/components/ModuleWidget";
import Empty from "@/shared/components/Empty";
import InfiniteScrollWrapper, {
  ISW,
} from "@/shared/components/InfiniteScrollWrapper";
import BlockStore, {
  BlockQuery,
  BlockTargetName,
  IBlockDto,
} from "@/shared/stores/BlockStore";
import { Button, List, message } from "antd";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import AccountItem from "./AccountItem";

interface IProps {
  targetName: BlockTargetName;
}

const BlockList: React.FC<IProps> = observer(({ targetName }) => {
  const ref = useRef<ISW<IBlockDto>>(null);
  return (
    <InfiniteScrollWrapper<IBlockDto, BlockQuery>
      ref={ref}
      query={{ filter: { targetName } }}
      fetchApi={(query) =>
        BlockStore.fetchSelfBlockList(query).then((res) => res.data)
      }
      empty={
        <Empty emptyImageUrl={notAuthSVG} emptyText={"这里似乎没有东西"} />
      }
      renderList={(data) => (
        <List
          dataSource={data}
          rowKey="_id"
          renderItem={(item, index) => {
            if (item.targetName === BlockTargetName.User) {
              return (
                <AccountItem
                  user={item.target}
                  action={
                    <Button
                      type="ghost"
                      danger
                      onClick={() =>
                        BlockStore.cancelBlock(
                          targetName,
                          item.target._id
                        ).then(() => {
                          message.success("移除成功");
                          ref.current?.remove(index);
                        })
                      }
                    >
                      移除屏蔽
                    </Button>
                  }
                />
              );
            }

            if (item.targetName === BlockTargetName.Mod) {
              return (
                <ModuleWidget
                  mod={item.target}
                  action={
                    <Button
                      type="ghost"
                      danger
                      onClick={() =>
                        BlockStore.cancelBlock(
                          targetName,
                          item.target._id
                        ).then(() => {
                          message.success("移除成功");
                          ref.current?.remove(index);
                        })
                      }
                    >
                      移除屏蔽
                    </Button>
                  }
                />
              );
            }

            return <div>未知的类型</div>;
          }}
        />
      )}
    />
  );
});

export default BlockList;
