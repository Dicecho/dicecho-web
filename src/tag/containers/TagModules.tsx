import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Card } from "antd";
import ModuleList from "@/module/components/ModuleList";
import { ITag } from "@/shared/stores/TagStore";
import ModuleStore, {
  IModListQuery,
  IModDto,
  ModSortKey,
} from "@/module/stores/ModuleStore";
import qs from 'qs';

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
  );
});

export default TagModules;
