import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { IRateDto } from "interfaces/shared/api";
import ScrollToTop from "@/shared/components/ScrollToTop";
import ResponsiveContainer from "@/shared/components/ResponsiveContainer";
import UIStore from "@/shared/stores/UIStore";
import { LoadingAnimation } from "@/shared/components/Loading";
import { message, Card, Col, Row } from "antd";
import RateItem from "@/rate/components/RateItem";
import RateStore from "@/rate/stores/RateStore";
import styles from "./RateContainer.module.less";

const RateContainer: React.FC = observer(() => {
  const route = useRouteMatch<{ uuid: string }>();
  const history = useHistory();
  const [rate, setRate] = useState<IRateDto | undefined>();
  const [initialized, setInitialized] = useState(
    rate && rate._id === route.params.uuid
  );

  useEffect(() => {
    if (initialized && rate && rate._id === route.params.uuid) {
      return;
    }

    RateStore.fetchRateDetailApi(route.params.uuid)
      .then((dto) => {
        setRate(dto);
      })
      .then(() => {
        setInitialized(true);
      });
  }, [route.params.uuid, initialized]);

  if (!initialized || !rate) {
    return (
      <div className={styles.loadingPage}>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <React.Fragment>
      <ScrollToTop pathname={`rate/${rate._id}`} />

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
              <RateItem
                rate={rate}
                showMod
                defaultCommentVisible={true}
                showAllComment
                onRemoved={() => {
                  history.push("/");
                }}
              />
            </Card>
          </Col>
        </Row>
      </ResponsiveContainer>
    </React.Fragment>
  );
});
export default RateContainer;
