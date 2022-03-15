import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useHistory, Link } from "react-router-dom";
import {
  Row,
  Col,
  Avatar,
  Button,
  Typography,
  Card,
  message,
  Popconfirm,
  Tooltip,
} from "antd";
import moment from "moment";
import ModuleItem from '@/module/components/ModuleItem'
import { Swiper, SwiperSlide } from '@/shared/components/Swiper';
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import CollectionItem from '@/collection/components/CollectionItem';
import ModuleStore from "@/module/stores/ModuleStore";
import ModuleAlbum from "@/module/components/ModuleAlbum";
import HomePageStore from "@/home/stores/HomePageStore";
import { ModuleEvent } from '../components/ModuleEvent';
import ModuleInfoItem from "@/module/components/ModuleInfoItem";
import TagItem from "@/tag/components/TagItem";
import ModuleRateList from "../components/ModuleRateList";
import RelatedModuleItem from "../components/RelatedModuleItem";
import styles from "./ModuleDetail.module.less";
import SettingStore from '@/shared/stores/SettingStore';
import AuthStore from "@/shared/stores/AuthStore";
import UIStore from "@/shared/stores/UIStore";
import { LanguageCodes_MAP, LanguageCodes } from '@/utils/language';
import { EyeInvisibleOutlined } from "@ant-design/icons";
import { useRecommendModule } from '../hooks/useModule';

const { Paragraph, Text, Title } = Typography;

const ModuleDetailHome: React.FC = observer(() => {
  const history = useHistory();
  const module = ModuleStore.moduleDetail;

  if (!module) {
    return null;
  }

  const { data: recommendMods, isLoading, error } = useRecommendModule(module._id);

  useEffect(() => {
    ModuleStore.fetchRelatedModule(module._id)
    ModuleStore.fetchRelatedCollection(module._id)
  }, [module._id])

  const Wrapper: React.FC = ({ children }) => {
    if (module.author.isForeign) {
      return (
        <Link 
          className='custom-link'
          to={`/module?keyword=${module.author.nickName}`}
          onClick={() => {
            UIStore.setSearchText(module.author.nickName)
          }}
        >
          {children}
        </Link>
      );
    }
    return (
      <AccountInfoWrapper _id={module.author._id}>
        {children}
      </AccountInfoWrapper>
    );
  };

  const activeEvent = HomePageStore.events.find(e => e.page === `module/${module._id}`)

  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          {activeEvent &&
            <ModuleEvent mod={module} event={activeEvent} style={{ marginBottom: 16 }} />
          }
          {module.origin !== 'booth' && module.imageUrls.length > 0 && (
            <Card bordered={false} style={{ marginBottom: 16 }}>
              <ModuleAlbum imageUrls={module.imageUrls} />
            </Card>
          )}
          {module.description &&
            <Card
              bordered={false}
              style={{ marginBottom: 16 }}
              className={styles.description}
            >
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: "展开全部" }}
              >
                {/* <MarkdownRender content={module.description} /> */}
                {module.description}
              </Paragraph>
            </Card>
          }
          {UIStore.isMobile && recommendMods && recommendMods.length > 0 && 
            <div className={styles.recommendCard} style={{ marginTop: 16, marginBottom: 16 }}>
              <div className={styles.recommendCardHeading} style={{ marginLeft: 16, marginBottom: 8 }}>相似模组</div>
              <Swiper
                slidesPerView={3.6}
                spaceBetween={16}
                slidesOffsetBefore={16}
                slidesOffsetAfter={16}
              >
                {recommendMods.map((module) => (
                  <SwiperSlide key={module._id}>
                    <Link to={`/module/${module._id}`}>
                      <ModuleItem module={module} ellipsis />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          }
          {SettingStore.rateAvailable &&
            <ModuleRateList module={module}/>
          }
          {ModuleStore.moduleRelated.length > 0 && UIStore.isMobile && (
            <Card
              title="作者其他模组"
              bordered={false}
              className={styles.moduleInfo}
              style={{ marginTop: 16 }}
            >
              {ModuleStore.moduleRelated.map((module) => (
                <Link to={`/module/${module._id}`} className='custom-link' key={module._id}>
                  <RelatedModuleItem module={module} />
                </Link>
              ))}
            </Card>
          )}
          {ModuleStore.collectionRelated.length > 0 && UIStore.isMobile && (
            <Card
              title="收录了此模组的列表"
              bordered={false}
              className={styles.moduleInfo}
              style={{ marginTop: 16 }}
            >
              {ModuleStore.collectionRelated.map((collection, index) => (
                <Link to={`/collection/${collection._id}`} className='custom-link' key={collection._id}>
                  <CollectionItem collection={collection} style={{ marginTop: index === 0 ? 0 : 8 }} />
                </Link>
              ))}
            </Card>
          )}
        </Col>
        <Col xs={0} sm={0} md={8}>
          <Card bordered={false} className={styles.moduleInfo}>
            <Tooltip overlay={`最后编辑于 ${moment(module.lastEditAt).format("YYYY年MM月DD日")}`}>
              <div>
                发布于 {moment(module.releaseDate).format("YYYY年MM月DD日")}
              </div>
            </Tooltip>
            <ModuleInfoItem
              title="原作者"
              content={
                <Wrapper>
                  <Avatar
                    size="small"
                    src={module.author.avatarUrl}
                    style={{ marginRight: 8 }}
                  />
                  {module.author.nickName}
                </Wrapper>
              }
            />
            {module.contributors.length > 0 && module.isForeign && (
              <ModuleInfoItem
                title="条目贡献者"
                content={
                  <Avatar.Group size="small" maxCount={4}>
                    {module.contributors.map((contributor) => (
                      <AccountInfoWrapper
                        _id={contributor._id}
                        key={contributor._id}
                      >
                        <Avatar
                          size="small"
                          src={contributor.avatarUrl}
                          style={{ marginRight: 8 }}
                        />
                      </AccountInfoWrapper>
                    ))}
                  </Avatar.Group>
                }
              />
            )}
            <ModuleInfoItem
              title="应用规则"
              content={<TagItem tag={module.moduleRule}/>}
            />
            {/* <ModuleInfoItem
              title="语言"
              content={(
                <div>
                  日语
                </div>
              )}
            /> */}
            {module.playerNumber.map((p) => p > 0).filter((i) => i).length ===
              2 && (
              <ModuleInfoItem
                title="人数"
                content={
                  module.playerNumber[0] === module.playerNumber[1] ? (
                    <div>{module.playerNumber[0]}</div>
                  ) : (
                    <div>
                      {module.playerNumber[0]}-{module.playerNumber[1]}
                    </div>
                  )
                }
              />
            )}

            {module.languages.length > 0 && (
              <ModuleInfoItem
                title="语言"
                content={
                  <div>
                    {module.languages.map((language) => (
                      <TagItem unlink tag={LanguageCodes_MAP[language as LanguageCodes]} key={language} />
                    ))}
                  </div>
                }
              />
            )}

            {module.tags.length > 0 && (
              <ModuleInfoItem
                title="标签"
                content={
                  <div>
                    {module.tags.map((tag) => (
                      <TagItem tag={tag} key={tag} />
                    ))}
                  </div>
                }
              />
            )}
            <div style={{ marginTop: 16 }}>
              {module.canEdit ? (
                <Link replace={true} to={`/module/${module._id}/edit`}>
                  <Button
                    block
                    ghost
                    style={{ marginRight: 8 }}
                    type="primary"
                  >
                    编辑
                  </Button>
                </Link>
              ) : module.isForeign ? (
                <Button
                  block
                  ghost
                  type="primary"
                  style={{ marginRight: 8 }}
                  onClick={() => {
                    if (!AuthStore.isAuthenticated) {
                      UIStore.openLoginModal();
                      message.error("请登录后再尝试");
                      return;
                    }
                    ModuleStore.applyEditor(module._id).then(() => {
                      message.success("已获得编辑权限");
                    });
                  }}
                >
                  申请编辑
                </Button>
              ) : null}
              <Popconfirm
                title="屏蔽后此模组将不会显示在你的搜索结果和模组列表当中"
                onConfirm={() =>
                  ModuleStore.blockMod(module._id).then(() => {
                    message.success("模组屏蔽成功")
                    if (history.length > 2) {
                      history.goBack();
                    } else {
                      history.replace('/module')
                    }
                  })
                }
                okText="屏蔽模组"
                cancelText="取消"
              >
                <Button 
                  danger
                  block
                  ghost
                  style={{ marginTop: 8 }}
                  icon={<EyeInvisibleOutlined />}
                >
                  屏蔽模组
                </Button>
              </Popconfirm>
              <Button 
                danger
                block
                ghost
                onClick={() => ModuleStore.setReportVisible(true)}
                style={{ marginTop: 8 }}
              >
                举报模组
              </Button>
              {!module.isForeign && module.canEdit &&
                <Popconfirm
                  title="撤稿后将停止内容分发，转为词条"
                  onConfirm={() =>
                    ModuleStore.withdrawMod(module._id).then(() => {
                      message.success('撤稿成功')
                      ModuleStore.updateModuleDetail(module._id);
                    })
                  }
                  okText="撤稿"
                  cancelText="取消"
                >
                  <Button 
                    danger
                    block
                    ghost
                    style={{ marginTop: 8 }}
                  >
                    撤稿
                  </Button>
                </Popconfirm>
              }
              {AuthStore.checkRole("superuser") && (
                <Popconfirm
                  title="确定要标记这个模组无效么"
                  onConfirm={() =>
                    ModuleStore.invalidMod(module._id).then(() =>
                      message.success("标记无效成功")
                    )
                  }
                  okText="标记"
                  cancelText="取消"
                >
                  <Button
                    // type='primary'
                    ghost
                    danger
                    block
                    style={{ marginTop: 8 }}
                  >
                    标记无效
                  </Button>
                </Popconfirm>
              )}
            </div>
          </Card>

          {!UIStore.isMobile && recommendMods && recommendMods.length > 0 && (
            <Card
              title="相似模组"
              bordered={false}
              className={styles.moduleInfo}
              style={{ marginTop: 16 }}
            >
              {recommendMods.map((module) => (
                <Link replace to={`/module/${module._id}`} className='custom-link' key={module._id}>
                  <RelatedModuleItem module={module} />
                </Link>
              ))}
            </Card>
          )}

          {ModuleStore.moduleRelated.length > 0 && (
            <Card
              title="作者其他模组"
              bordered={false}
              className={styles.moduleInfo}
              style={{ marginTop: 16 }}
            >
              {ModuleStore.moduleRelated.map((module) => (
                <Link replace to={`/module/${module._id}`} className='custom-link' key={module._id}>
                  <RelatedModuleItem module={module} />
                </Link>
              ))}
            </Card>
          )}

          {ModuleStore.collectionRelated.length > 0 && (
            <Card
              title="收录了此模组的列表"
              bordered={false}
              className={styles.moduleInfo}
              style={{ marginTop: 16 }}
            >
              {ModuleStore.collectionRelated.map((collection, index) => (
                <Link to={`/collection/${collection._id}`} className='custom-link' key={collection._id}>
                  <CollectionItem collection={collection} style={{ marginTop: (index === 0 ? 0 : 8) }} />
                </Link>
              ))}
            </Card>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
});
export default ModuleDetailHome;
