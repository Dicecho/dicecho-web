import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Button, Spin, Card } from "antd";
import { CardProps } from 'antd/lib/card'
import notAuthSVG from "@/assets/svg/notAuth.svg";
import ModuleStore, { IModListQuery, IModDto } from "@/module/stores/ModuleStore";
import ModuleList from '@/module/components/ModuleList';
import Empty from "@/shared/components/Empty";
import { IAccountDto } from '../stores/AccountStore';
import AuthStore from "@/shared/stores/AuthStore";

interface IProps extends CardProps {
  user: IAccountDto,
  hidden?: boolean,
}

const AccountModulesCard: React.FC<IProps> = observer(({ user, hidden = false, ...props }) => {
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1);
  const [modules, setModules] = useState<Array<IModDto>>([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [initialized, setInitialized] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const pageSize = 8;

  useEffect(() => {
    if (currentUserId !== user._id) {
      setInitialized(false);
      setCurrentUserId(user._id)
    }
    const query: Partial<IModListQuery> = {
      page,
      pageSize,
      filter: {
        author: user._id,
      },
    };

    ModuleStore.fetchModuleList(query).then((res) => {
      setModules(res.data)
      setTotal(res.totalCount)
      setInitialized(true);
    })
  }, [user._id, page, currentUserId])

  if (initialized && total === 0 && hidden) {
    return null;
  }

  const renderContent = () => {
    if (!initialized) {
      return (
        <div
          style={{
            width: "100%",
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin />
        </div>
      );
    }
  
    if (total === 0) {
      return (
        <Empty emptyImageUrl={notAuthSVG} emptyText={"暂无投稿"}>
          {AuthStore.user._id === user._id &&
            <Link to='/module/submission'>
              <Button type='primary'>
                立刻投稿
              </Button>
            </Link>
          }
        </Empty>
      );
    }

    return (
      <React.Fragment>
        <ModuleList
          grid={{
            // @ts-ignore
            gutter: [40, 16],
            xs: 2,
            sm: 3,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 5,
          }}
          dataSource={modules}
          rowKey="_id"
          pagination={total <= pageSize ? false : {
            pageSize,
            defaultCurrent: page,
            current: page,
            total,
            showQuickJumper: true,
            onChange: (p) => {
              setPage(p);
            },
          }}
        />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div ref={headerRef} />
      <Card
        bordered={false}
        title='投稿作品'
        {...props}
      >
        {renderContent()}
      </Card>
    </React.Fragment>
  );
});
export default AccountModulesCard;
