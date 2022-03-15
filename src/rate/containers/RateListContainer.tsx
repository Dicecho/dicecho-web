import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { IRateDto } from "interfaces/shared/api";
import InfiniteScrollWrapper from "@/shared/components/InfiniteScrollWrapper";
import ResponsiveContainer from "@/shared/components/ResponsiveContainer";
import UIStore from "@/shared/stores/UIStore";
import { Card, Col, Row, Spin, List } from "antd";
import RateItem from "@/rate/components/RateItem";
import RateStore, { IRateListQuery } from "@/rate/stores/RateStore";
import RateFilter from '../components/RateFilter';

const RateListContainer: React.FC = observer(() => {
  const [query, setQuery] = useState<Partial<IRateListQuery>>({
    sort: { createdAt: -1 }
  })

  return (
    <React.Fragment>
      <ResponsiveContainer
        mobileAvaliable={false}
        style={{
          paddingTop: UIStore.isMobile ? 0 : 32,
          paddingBottom: UIStore.isMobile ? 0 : 32,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <Card bordered={false}>
              <div style={{ marginBottom: 16 }}>
                <RateFilter onChange={(q) => setQuery(q)} />
              </div>

              <InfiniteScrollWrapper<IRateDto, IRateListQuery>
                query={query}
                fetchApi={RateStore.fetchModuleRateListApi}
                renderList={(data) => (
                  <List
                    dataSource={data}
                    rowKey="_id"
                    renderItem={(item, index) => (
                      <RateItem
                        showMod
                        rate={item}
                      />
                    )}
                  />
                )}
              />
            </Card>
          </Col>
        </Row>
      </ResponsiveContainer>
    </React.Fragment>
  );
});
export default RateListContainer;
