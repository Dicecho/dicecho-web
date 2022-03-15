import React, { useEffect, useState } from "react";
import { BackTop, List, Col, Row, Card, Button, Modal } from "antd";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ModSortKey } from "@/interfaces/shared/api";
import ScrollToTop from "@/shared/components/ScrollToTop";
import discordSVG from "@/assets/svg/Discord-Logo-White.svg";
import { DEFAULT_BANNER } from "@/shared/constants";
import ActionCarousel from "@/shared/components/ActionCarousel";
import ModuleList from "@/module/components/ModuleList";
import CollectionCard from '@/collection/components/CollectionCard'
import ModuleItem from '@/module/components/ModuleItem'
import { Swiper, SwiperSlide } from '@/shared/components/Swiper';
import AppInfo from "@/shared/components/AppInfo";
import HomepageProfile from "@/home/components/HomepageProfile";
import HomepageAccountActions from "@/home/components/HomepageAccountActions";
import HomePageStore from "../stores/HomePageStore";
import UIStore from '@/shared/stores/UIStore';
import { observer } from "mobx-react";
import styles from "./HomePageContainer.module.less";
import qs from 'qs';
import classnames from 'classnames';
import { VerticalAlignTopOutlined, WeiboOutlined, QqOutlined } from "@ant-design/icons";
import { CollectionSingleStore, ICollectionDto } from "@/collection/store/CollectionStore";
import AuthStore from "@/shared/stores/AuthStore";

const HomePageContainer: React.FunctionComponent = observer(() => {
  const history = useHistory();

  useEffect(() => {
    HomePageStore.initStore();
  }, []);

  const banners = HomePageStore.initialized
    ? HomePageStore.banners
    : [DEFAULT_BANNER];
  
  if (UIStore.isMobile) {
    return (
      <React.Fragment>
        <Helmet title={`首页 | 骰声回响`}/>
        <ScrollToTop />

        <ActionCarousel
          dots
          autoplay
          className={styles.homepageBanner}
          wrapperProps={{
            style: { marginBottom: 16 },
          }}
        >
          {banners.map((banner) => (
            <div
              className={styles.homepageBannerImgWrapper}
              key={banner.imageUrl}
            >
              <div
                onClick={() => {
                  if (banner.action === "jump") {
                    return history.push(banner.link)
                  }
                }}
                className={styles.homepageBannerImg}
                style={{ 
                  backgroundImage: `url(${banner.imageUrl})`,
                  cursor: banner.action === '' ? 'default' : 'pointer',
                }}
              />
            </div>
          ))}
        </ActionCarousel>

        <div className={classnames(styles.block, 'container')} style={{ marginBottom: 16 }}>
          <div className={styles.blockTitle}>
            推荐合集
          </div>
        </div>
        <Swiper 
          slidesPerView={3.5}
          spaceBetween={16}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
        >
          {CollectionSingleStore.recommendCollection.map((collection) => (
            <SwiperSlide key={collection._id}>
              <Link to={`/collection/${collection._id}`}>
                <CollectionCard collection={collection}/>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={classnames(styles.block, 'container')} style={{ margin: '16px 0' }}>
          <div className={styles.blockTitle}>
            最新投稿
          </div>
          <Link
            style={{ marginLeft: "auto" }}
            to={`/module?${qs.stringify({ filter: { isForeign: false }, sort: { [ModSortKey.CREATED_AT]: -1 } })}`}
          >
            查看更多 &gt;&gt;
          </Link>
        </div>
        <Swiper 
          slidesPerView={3.5}
          spaceBetween={16}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
        >
          {HomePageStore.recentlyMods.map((module) => (
            <SwiperSlide key={module._id}>
              <Link to={`/module/${module._id}`}>
                <ModuleItem module={module} ellipsis />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={classnames(styles.block, 'container')} style={{ margin: '16px 0' }}>
          <div className={styles.blockTitle}>
          一周热门模组
          </div>
        </div>
        <Swiper 
          slidesPerView={3.5}
          spaceBetween={16}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
        >
          {HomePageStore.hotMods.map((module) => (
            <SwiperSlide key={module._id}>
              <Link to={`/module/${module._id}`}>
                <ModuleItem module={module} ellipsis />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={classnames(styles.block, 'container')} style={{ margin: '16px 0' }}>
          <div className={styles.blockTitle}>
          新增词条
          </div>
          <Link
            style={{ marginLeft: "auto", fontSize: 14 }}
            to={`/module?${qs.stringify({ filter: { isForeign: true }, sort: { [ModSortKey.CREATED_AT]: -1 } })}`}
          >
            查看更多 &gt;&gt;
          </Link>
        </div>

        <Swiper 
          slidesPerView={3.5}
          spaceBetween={16}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
        >
        {HomePageStore.recentlyForeignMods.map((module) => (
          <SwiperSlide key={module._id}>
            <Link to={`/module/${module._id}`}>
              <ModuleItem module={module} ellipsis />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      </React.Fragment>
    )
  }


  return (
    <React.Fragment>
      <Helmet title={`首页 | 骰声回响`}/>
      <ScrollToTop />
      <div className="container" style={{ paddingTop: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24}></Col>
          <Col xs={24} sm={24} md={16}>
            <ActionCarousel
              dots
              autoplay
              className={styles.homepageBanner}
              wrapperProps={{
                style: { marginBottom: 16 },
              }}
            >
              {banners.map((banner) => (
                <div
                  className={styles.homepageBannerImgWrapper}
                  key={banner.imageUrl}
                >
                  <div
                    onClick={() => {
                      if (banner.action === "open") {
                        return window.open(banner.link)
                      }
                      if (banner.action === "jump") {
                        return history.push(banner.link)
                      }
                    }}
                    className={styles.homepageBannerImg}
                    style={{ 
                      backgroundImage: `url(${banner.imageUrl})`,
                      cursor: banner.action === '' ? 'default' : 'pointer',
                    }}
                  />
                </div>
              ))}
            </ActionCarousel>
            <Card
              className={styles.card}
              bordered={false}
              style={{ marginBottom: 16 }}
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  推荐合辑
                </div>
              }
              loading={!HomePageStore.initialized}
            >
              <List 
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
                dataSource={CollectionSingleStore.recommendCollection}
                rowKey="_id"
                renderItem={(collection: ICollectionDto) => (
                  <List.Item key={collection._id} style={{ marginBottom: 0 }}>
                    <Link to={`/collection/${collection._id}`}>
                      <CollectionCard collection={collection}/>
                    </Link>
                  </List.Item>
                )}
              />
            </Card>
            <Card
              className={styles.card}
              bordered={false}
              style={{ marginBottom: 16 }}
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  最新投稿
                  <Link
                    style={{ marginLeft: "auto", fontSize: 14 }}
                    to={`/module?${qs.stringify({ filter: { isForeign: false }, sort: { [ModSortKey.CREATED_AT]: -1 } })}`}
                  >
                    查看更多 &gt;&gt;
                  </Link>
                </div>
              }
              loading={!HomePageStore.initialized}
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
                dataSource={HomePageStore.recentlyMods}
                rowKey="_id"
              />
            </Card>

            <Card
              className={styles.card}
              bordered={false}
              style={{ marginBottom: 16 }}
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  一周热门模组
                  <Link
                    style={{ marginLeft: "auto", fontSize: 14 }}
                    to={`/module`}
                  >
                    查看更多 &gt;&gt;
                  </Link>
                </div>
              }
              loading={!HomePageStore.initialized}
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
                dataSource={HomePageStore.hotMods}
                rowKey="_id"
              />
            </Card>

            <Card
              className={styles.card}
              bordered={false}
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  新增词条
                  <Link
                    style={{ marginLeft: "auto", fontSize: 14 }}
                    to={`/module?${qs.stringify({ filter: { isForeign: true }, sort: { [ModSortKey.CREATED_AT]: -1 } })}`}
                  >
                    查看更多 &gt;&gt;
                  </Link>
                </div>
              }
              loading={!HomePageStore.initialized}
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
                dataSource={HomePageStore.recentlyForeignMods}
                rowKey="_id"
              />
            </Card>
          </Col>
          <Col xs={0} sm={0} md={8}>
            {/* <Affix offsetTop={80}> */}
            {/* <div> */}
            {AuthStore.isAuthenticated &&
              <Card bordered={false} style={{ marginBottom: 16 }}>
                <HomepageProfile />
                <HomepageAccountActions />
              </Card>
            }
              {/* <a href="https://discord.gg/23btxGkk" target="_blank">
                <div className={styles.discordBrand} style={{ marginBottom: 16 }}>
                  <img src={discordSVG} width={32} style={{ marginRight: 8 }}/>
                  官方DISCORD服务器
                </div>
              </a> */}
              <Button 
                href="https://jq.qq.com/?_wv=1027&k=U69VlAni"
                target="_blank"
                block
                type='primary'
                icon={(<QqOutlined />)}
                style={{ marginBottom: 8 }}
              >
                官方qq群
              </Button>
              <Button 
                href="https://weibo.com/u/7575371655"
                target="_blank"
                block
                type='primary'
                icon={(<WeiboOutlined />)}
                style={{ marginBottom: 8 }}
              >
                官博 @骰声回响Dicecho
              </Button>
              <Button 
                href="https://discord.gg/GdV3BMrABX"
                target="_blank"
                block
                type='primary'
                // ghost
                icon={(<img src={discordSVG} width={16} style={{ marginRight: 8 }}/>)}
                style={{ marginBottom: 8 }}
              >
                官方DISCORD服务器
              </Button>
              <AppInfo />
            {/* </div> */}
            {/* </Affix> */}
          </Col>
        </Row>
      </div>
      <BackTop >
        <div className='custom-back-top'>
          <VerticalAlignTopOutlined />
        </div>
      </BackTop>
    </React.Fragment>
  );
});
export default HomePageContainer;
