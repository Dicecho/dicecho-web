import React, { Component, useEffect, useState } from "react";
import classNames from "classnames";
import { Helmet } from "react-helmet";
import ResponsiveContainer from "@/shared/components/ResponsiveContainer";
import { LoadingAnimation } from "@/shared/components/Loading";
import { ResponseError } from "@/interfaces/response";
import { Error } from "@/shared/components/Empty";
import UIStore from "@/shared/stores/UIStore";
import { HeaderLayout, HeaderBack } from "@/shared/components/Header";
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import {
  EllipsisOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  OrderedListOutlined,
  FullscreenOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import CustomizedFooter from "@/shared/layout/CustomizedFooter";
import ModuleWidget from '@/module/components/ModuleWidget';
import { observer } from "mobx-react";
import { useRouteMatch, Link } from "react-router-dom";
import { Col, Row, Avatar, Drawer, Card, Typography, Button } from "antd";
import { singleReplayStore, IReplayDto } from "../stores/ReplayStore";
import classnames from 'classnames';
import styles from "./ReplayContainer.module.less";

const { Paragraph } = Typography;

const ReplayContainer: React.FunctionComponent = observer(() => {
  const [page, setPage] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [rotate, setRotate] = useState(false);
  const route = useRouteMatch<{ bvid: string }>();
  const [initialized, setInitialized] = useState(false);
  const [err, setErr] = useState<ResponseError>();
  const [replay, setReplay] = useState<IReplayDto>();

  useEffect(() => {
    singleReplayStore.fetchDetail(route.params.bvid)
      .then((res) => {
        setReplay(res.data);
        if (res.data.videos > 1) {
          setPage(1);
        }
      })
      .catch((err) => {
        setErr(err);
      })
      .finally(() => {
        setInitialized(true);
      });
  }, [route.params.bvid]);


  if (!initialized) {
    return (
      <div className={styles.loadingPage}>
        <LoadingAnimation />
      </div>
    );
  }

  if (err) {
    if (err.response?.data.detail) {
      return (
        <Error text={err.response?.data.detail}/>
      )
    }

    return null;
  }

  if (!replay) {
    return (
      <div className={styles.loadingPage}>
        <LoadingAnimation />
      </div>
    );
  }

  const src = `//player.bilibili.com/player.html?bvid=${route.params.bvid}&high_quality=1` + (page !== 0 ? `&page=${page}` : "")

  if (UIStore.isMobile) {
    return (
      <React.Fragment>
        <Helmet title={`${replay.title} | 视频 | 骰声回响`} />
        <CustomizedHeader options={{ transparent: true, visible: !rotate }}>
          <HeaderLayout
            className={`${styles.header}`}
            left={<HeaderBack />}
            titleProps={{ className: styles.headerTitle }}
            title={null}
            right={<EllipsisOutlined />}
          />
        </CustomizedHeader>
        <CustomizedFooter visible={false} />
        <div
          className={classNames(styles.replayFrameWrapper, {
            [styles.rotate]: rotate,
          })}
        >
          <iframe
            className={styles.replayFrame}
            key={src}
            src={src}
            scrolling="no"
            frameBorder="no"
            height={rotate ? '100%' : '33%'}
            width="100%"
            allowFullScreen={true}
          />
          {!rotate &&
            <div className='container' style={{ marginTop: 8 }}>
              <div className={styles.videoInfo}>
                <h3 style={{ marginRight: 8 }}>
                  {replay.title}
                </h3>

                <Button 
                  style={{ marginLeft: 'auto' }}
                  type='primary'
                  icon={<FullscreenOutlined />}
                  onClick={() => setRotate(true)}
                >
                  全屏
                </Button>
              </div>

              <div className={styles.videoAuthor} style={{ marginBottom: 16 }}>
                <Avatar src={replay.owner.face} style={{ marginRight: 8 }} />
                <a
                  href={`https://space.bilibili.com/${replay.owner.mid}`}
                  target="_blank"
                >
                  {replay.owner.name}
                </a>
              </div>

              <div className={styles.mobileCopyright} style={{ marginBottom: 16 }}>
                <InfoCircleOutlined className={styles.infoIcon} style={{ marginRight: 8 }} />
                此视频使用bilibili内置的分享组件进行播放，并非转载
                <a
                  target="_blank"
                  href="https://www.bilibili.com/blackboard/help.html#/?qid=4d2971497eaf4cf9bec55c26c9a2983d&pid=02e75f961e554e89b61d0d5fb5b10b0a"
                >
                  详情
                </a>
              </div>

              {replay.mod && (
                <Link to={`/module/${replay.mod._id}`} style={{ width: "100%", marginBottom: 16 }}>
                  <ModuleWidget mod={replay.mod}/>
                </Link>
              )}

              {replay.description &&
                <div style={{ marginBottom: 16, whiteSpace: "break-spaces" }}>
                  {replay.description}
                </div>
              }

              {(replay.videos || 0) > 1 && (
                <div className={styles.videoList}>
                  {replay.pages.map((video) => (
                    <div
                      className={classNames(styles.pageItem, {
                        [styles.active]: video.page === page,
                      })}
                      key={video.page}
                      onClick={() => setPage(video.page)}
                    >
                      {video.part}
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
          <div>
          </div>
          <div className={styles.iconWrapper}>
            <div className={styles.iconList}>
              {rotate ? (
                <RotateRightOutlined
                  className={styles.icon}
                  onClick={() => setRotate(false)}
                />
              ) : (
                <RotateLeftOutlined
                  className={styles.icon}
                  onClick={() => setRotate(true)}
                />
              )}
              {(replay.videos || 0) > 1 && (
                <OrderedListOutlined
                  className={styles.icon}
                  onClick={() => setDrawerVisible(true)}
                />
              )}
            </div>
          </div>
        </div>

        <Drawer
          title={null}
          className={classNames(styles.drawer, { [styles.rotate]: rotate })}
          placement={rotate ? "bottom" : "right"}
          closable={false}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
        >
          {replay.pages.map((video) => (
            <div
              className={classNames(styles.pageItem, {
                [styles.active]: video.page === page,
              })}
              key={video.page}
              onClick={() => setPage(video.page)}
            >
              {video.part}
            </div>
          ))}
        </Drawer>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Helmet title={`${replay.title} | 视频 | 骰声回响`} />
      <ResponsiveContainer style={{ paddingTop: 32 }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <div className={styles.replayTitle} style={{ marginBottom: 4 }}>
              {replay.title}
            </div>
            <div style={{ marginBottom: 8 }}>
              <i className="secondary-text">
                [此视频使用bilibili内置的分享组件进行播放，并非转载，
                <a
                  target="_blank"
                  href="https://www.bilibili.com/blackboard/help.html#/?qid=4d2971497eaf4cf9bec55c26c9a2983d&pid=02e75f961e554e89b61d0d5fb5b10b0a"
                >
                  详情
                </a>
                ]
              </i>
            </div>
            <div
              className={styles.replayFrameWrapper}
              style={{ marginBottom: 16 }}
            >
              <iframe
                className={styles.replayFrame}
                key={src}
                src={src}
                scrolling="no"
                frameBorder="no"
                height="100%"
                width="100%"
                allowFullScreen={true}
              />
            </div>
            {replay.mod && (
              <Link to={`/module/${replay.mod._id}`} style={{ width: "100%" }}>
                <ModuleWidget mod={replay.mod}/>
              </Link>
            )}
            {replay.description && (
              <Card
                bordered={false}
                style={{ marginBottom: 16, whiteSpace: "break-spaces" }}
              >
                {replay.description}
              </Card>
            )}
          </Col>

          <Col xs={0} sm={0} md={8}>
            {replay.owner && (
              <Card bordered={false} style={{ marginBottom: 16 }}>
                <div>
                  <Avatar src={replay.owner.face} style={{ marginRight: 8 }} />
                  <a
                    href={`https://space.bilibili.com/${replay.owner.mid}`}
                    target="_blank"
                  >
                    {replay.owner.name}
                  </a>
                </div>
              </Card>
            )}

            {(replay.videos || 0) > 1 && (
              <Card
                bordered={false}
                style={{ marginBottom: 16 }}
                title={"视频选集"}
              >
                {replay.pages.map((video) => (
                  <div
                    className={classNames(styles.pcPageItem, {
                      [styles.active]: video.page === page,
                    })}
                    key={video.page}
                    onClick={() => setPage(video.page)}
                  >
                    {video.part}
                  </div>
                ))}
              </Card>
            )}
          </Col>
        </Row>
      </ResponsiveContainer>
    </React.Fragment>
  );
});
export default ReplayContainer;
