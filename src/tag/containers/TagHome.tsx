import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Divider, Typography } from "antd";
import ModuleList from "@/module/components/ModuleList";
import TagItem from "@/tag/components/TagItem";
import { ITag } from "@/shared/stores/TagStore";
import ModuleStore, {
  IModListQuery,
  IModDto,
  ModSortKey,
} from "@/module/stores/ModuleStore";
import qs from 'qs';

const { Title} = Typography;

interface TagModulesProp {
  tag: ITag;
}

const TagModules: React.FC<TagModulesProp> = observer(({
  tag,
}) => {
  const [modules, setModules] = useState<Array<IModDto>>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const query: Partial<IModListQuery> = {
      page: 1,
      pageSize: 20,
      tags: [tag.name],
      sort: { [ModSortKey.LAST_RATE_AT]: -1 },
    };

    ModuleStore.fetchModuleList(query).then((res) => {
      setModules(res.data);
    }).then(() => {
      setInitialized(true);
    });
  }, [tag]);


  return (

    <Row gutter={16}>
    <Col xs={24} sm={24} md={16}>

    <Card
      bordered={false}
      style={{ marginBottom: 16 }}
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          相关模组({tag.modCount})
          <Link
            style={{ marginLeft: "auto", fontSize: 14 }}
            to={`/module?${qs.stringify({ tags: [tag.name] })}`}
          >
            查看更多 &gt;&gt;
          </Link>
        </div>
      }
      loading={!initialized}
    >
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
      />
    </Card>
    </Col>
    
    <Col xs={0} sm={0} md={8}>
      {tag.description &&
        <Card bordered={false} title='标签描述' style={{ marginBottom: 8 }}>
          <Typography>
            {tag.description}
          </Typography>
        </Card>
      }
  
      {(tag.parents.length > 0 || tag.children.length > 0) &&
        <Card bordered={false} title='相关标签'>
          {tag.parents.length > 0 &&
            <React.Fragment>
              <Title level={5}>父元素</Title>
              <Divider />
              {tag.parents.map(tag => <TagItem tag={tag} key={tag} />)}
            </React.Fragment>
          }
          {tag.children.length > 0 &&
            <React.Fragment>
              <Title level={5}>子元素</Title>
              <Divider />
              {tag.children.map(tag => <TagItem tag={tag} key={tag} />)}
            </React.Fragment>
          }
        </Card>
      }
    </Col>
  </Row>
  );
});

export default TagModules;
