import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { Row, Col, message, Card, Button, Spin } from "antd";
import ModuleStore from "@/module/stores/ModuleStore";
import UIStore from '@/shared/stores/UIStore';
import styles from './ModuleDetailForum.module.less';
import { EditOutlined } from "@ant-design/icons";
import InfiniteScrollWrapper from "@/shared/components/InfiniteScrollWrapper";
import { TopicSingleStore, TopicListQuery, ITopicDto } from '@/forum/stores/TopicStore';
import TopicCard from "@/forum/components/TopicCard";
import { openTopicPostFuncModal } from '@/forum/components/TopicPostModal';
import { DomainSingleStore, IDomainDto } from "@/forum/stores/DomainStore";


const ModuleDetailForum: React.FC = observer(() => {
  const history = useHistory();

  const [total, setTotal] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const module = ModuleStore.moduleDetail;

  if (!module) {
    return null;
  }

  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <Card 
            bordered={false}
            style={{ marginBottom: 8 }}
          >
              <div className={styles.cardTitle}>
                {(initialized) 
                  ? total
                  : <Spin style={{ marginRight: 8 }} />
                } 个帖子

                <Button 
                  type='primary'
                  style={{ marginLeft: 'auto' }}
                  onClick={() => openTopicPostFuncModal({
                    defaultData: {
                      relatedMods: [module,],
                      domain: {
                        _id: '6059004d10cdbcae6e48d55c',
                        title: '模组讨论',
                      }
                    },
                    onSubmit: async (dto) => {
                      const defaultModDomain = await DomainSingleStore.getDefaultModDomain()
                      TopicSingleStore.createObj({
                        domainId: defaultModDomain._id,
                        ...dto,
                      })
                      .then((obj) => {
                        TopicSingleStore.insertObj(obj);
                        message.success('发布成功')
                      })
                    }
                  })}
                >
                  发布新帖
                </Button>
              </div>
          </Card>

          <InfiniteScrollWrapper<ITopicDto, TopicListQuery>
            fetchApi={
              (query) => TopicSingleStore.fetchList(query)
                .then((res) => { 
                  setInitialized(true)
                  setTotal(res.totalCount)
                  return res;
                })
            }
            query={{ modId: module._id, sort: { 'lastCommentedAt': -1 } }}
            renderList={(data) => (
              <React.Fragment>
                {data.map((topic) => <TopicCard topic={topic} key={topic._id}/>)}
              </React.Fragment>
            )}
          />
        </Col>
        <Col xs={0} sm={0} md={8}>
        </Col>
      </Row>

      {UIStore.isMobile &&
        <div className={`ant-back-top`}>
          <div
            className={`${styles.backTop}`}
            onClick={() => openTopicPostFuncModal({
              defaultData: {
                relatedMods: [module,],
                domain: {
                  _id: '6059004d10cdbcae6e48d55c',
                  title: '模组讨论',
                }
              },
              onSubmit: async (dto) => {
                const defaultModDomain = await DomainSingleStore.getDefaultModDomain()
                TopicSingleStore.createObj({
                  domainId: defaultModDomain._id,
                  ...dto,
                })
                .then((obj) => {
                  TopicSingleStore.insertObj(obj);
                  message.success('发布成功')
                })
              }
            })}
          >
            <EditOutlined />
          </div>
        </div>
      }
    </React.Fragment>
  );
});
export default ModuleDetailForum;
