import notAuthSVG from "@/assets/svg/notAuth.svg";
import HomepageProfile from "@/home/components/HomepageProfile";
import ActionCarousel from "@/shared/components/ActionCarousel";
import AppInfo from "@/shared/components/AppInfo";
import Empty from "@/shared/components/Empty";
import InfiniteScrollWrapper from "@/shared/components/InfiniteScrollWrapper";
import AuthStore from "@/shared/stores/AuthStore";
import UIStore from "@/shared/stores/UIStore";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Affix, Button, Card, Col, List, Row } from "antd";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ReplayItem from "../components/ReplayItem";
import ReplayUploadModal from "../components/ReplayUploadModal";
import {
  IReplayDto,
  IReplayListQuery,
  singleReplayStore,
} from "../stores/ReplayStore";
import styles from "./ReplayListContainer.module.less";

const ReplayListContainer: React.FunctionComponent = observer(() => {
  const history = useHistory();
  const [uploadModalVisible, setUploadVisible] = useState(false);
  useEffect(() => {
    if (singleReplayStore.datas.length !== 0) {
      return;
    }

    singleReplayStore.initRecommend();
  }, []);

  const renderList = () => {
    return (
      <InfiniteScrollWrapper<IReplayDto, IReplayListQuery>
        // ref={ref}
        query={{ sort: { createdAt: -1 } }}
        fetchApi={(query) => singleReplayStore.fetchList(query)}
        empty={
          <Empty emptyImageUrl={notAuthSVG} emptyText={"这里似乎没有东西"} />
        }
        renderList={(data) => (
          <List
            dataSource={data}
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
            rowKey="bvid"
            renderItem={(replay: IReplayDto) => (
              <List.Item key={replay.bvid} style={{ marginBottom: 0 }}>
                <Link to={`/replay/${replay.bvid}`}>
                  <ReplayItem replay={replay} />
                </Link>
              </List.Item>
            )}
          />
        )}
      />
    );
  };

  return (
    <React.Fragment>
      <div
        className="container"
        style={{ paddingTop: UIStore.isMobile ? 8 : 32, marginBottom: 32 }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <ActionCarousel
              dots
              autoplay
              className={styles.homepageBanner}
              wrapperProps={{
                style: { marginBottom: 16 },
              }}
            >
              {singleReplayStore.recommends.map((replay) => (
                <div
                  className={styles.homepageBannerImgWrapper}
                  key={replay.bvid}
                >
                  <div
                    onClick={() => history.push(`/replay/${replay.bvid}`)}
                    className={styles.homepageBannerImg}
                    style={{
                      backgroundImage: `url(${replay.coverUrl})`,
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
            </ActionCarousel>

            {renderList()}
          </Col>
          <Col xs={0} sm={0} md={8}>
            <Affix offsetTop={80}>
              <div>
                {AuthStore.isAuthenticated && (
                  <Card bordered={false} style={{ marginBottom: 16 }}>
                    <HomepageProfile />
                    <Button
                      block
                      type="primary"
                      ghost
                      icon={<PlusCircleOutlined />}
                      onClick={() => setUploadVisible(true)}
                    >
                      分享新视频
                    </Button>
                  </Card>
                )}
                {/* <Card
                  title="筛选"
                  bordered={false}
                  style={{ marginBottom: 16 }}
                >
                  {renderFilter()}
                </Card> */}
                <AppInfo />
              </div>
            </Affix>
          </Col>
        </Row>
      </div>

      <ReplayUploadModal
        visible={uploadModalVisible}
        onCancel={() => setUploadVisible(false)}
        onSubmit={(bvid) =>
          singleReplayStore.fetchDetail(bvid).then((res) => {
            setUploadVisible(false);
            history.push(`/replay/${res.data.bvid}`);
          })
        }
      />
    </React.Fragment>
  );
});
export default ReplayListContainer;
