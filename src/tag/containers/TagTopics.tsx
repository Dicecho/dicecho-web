import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { List, Spin, Card, Pagination } from "antd";
import { CardProps } from 'antd/lib/card'
import TopicItem from '@/forum/components/TopicItem';
import { TopicSingleStore, TopicListQuery, ITopicDto } from '@/forum/stores/TopicStore';
import notAuthSVG from "@/assets/svg/notAuth.svg";
import Empty from "@/shared/components/Empty";
import { ITag } from "@/shared/stores/TagStore";

interface IProps extends CardProps {
  tag: ITag,
}

const TagTopics: React.FC<IProps> = observer(({
  tag,
  ...props
}) => {
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1);
  const [topics, setTopics] = useState<Array<ITopicDto>>([])
  const [initialized, setInitialized] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const pageSize = 10;

  useEffect(() => {
    const query: Partial<TopicListQuery> = {
      page,
      pageSize,
      // filter: { author: user._id },
    };

    TopicSingleStore.fetchList(query).then((res) => {
      setTopics(res.data)
      setTotal(res.totalCount)
      setInitialized(true);
    });
  }, [tag.name, page])

  const renderHeader = () => {
    if (total <= pageSize) {
      return null
    }
    return (
      <Pagination
        style={{ marginTop: 8 }}
        responsive
        defaultCurrent={page}
        current={page}
        pageSize={pageSize}
        total={total}
        onChange={(p) => {
          setPage(p);
        }}
      />
    )
  };

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
        <Empty emptyImageUrl={notAuthSVG} emptyText={"暂无帖子"} />
      );
    }

    return (
      <React.Fragment>
        {renderHeader()}
        <List
          dataSource={topics}
          rowKey="_id"
          renderItem={(item) => (
            <Link to={`/forum/topic/${item._id}`}>
              <TopicItem topic={item}/>
            </Link>
          )}
          pagination={total <= pageSize ? false : {
            defaultCurrent: page,
            current: page,
            pageSize,
            total: total,
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
        {...props}
        bordered={false}
        title={(
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>帖子列表 - </span>
            <span style={{ margin: '0px 4px' }}>
              {initialized 
                ? total
                : <Spin style={{ display: 'flex' }} />
              }
            </span>
            篇帖子
          </div>
        )}
      >
        {renderContent()}
      </Card>
    </React.Fragment>
  );
});
export default TagTopics;
