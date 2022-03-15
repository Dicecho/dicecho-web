import React, { useState, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { observer } from "mobx-react";
import { Helmet } from "react-helmet";
import ScrollToTop from "@/shared/components/ScrollToTop";
import { SortOrder } from "interfaces/shared/api";
import { CommentDto, CommentSortKey } from '@/shared/stores/CommentStore';
import { CommentBox, MobileCommentBox } from "@/shared/components/Comment";
import { useHistory, useRouteMatch, Switch, Route } from "react-router-dom";
import { Row, Col, Card, Select, Button, Tabs } from "antd";
import AuthStore from '@/shared/stores/AuthStore';
import { LoadingAnimation } from "@/shared/components/Loading";
import { ResponseError } from "@/interfaces/response";
import CustomizedFooter from "@/shared/layout/CustomizedFooter";
import CollectionHeader from "../components/CollectionHeader";
import CollectionDetailCard from "../components/CollectionDetailCard";
import CollectionMobileHeader from "../components/CollectionMobileHeader";
import { Error } from "@/shared/components/Empty";
import UIStore from "@/shared/stores/UIStore";
import {
  CollectionSingleStore,
  ICollectionDto,
  ICollectionItem,
} from "../store/CollectionStore";
import CollectionItemList from "../components/CollectionItemList";
import { useIsMounted } from "react-tidy";
import styles from "./CollectionDetailContainer.module.less";

const { Option } = Select;
const { TabPane } = Tabs;

const CollectionDetailContainer: React.FC = observer((props) => {
  const history = useHistory();
  const route = useRouteMatch<{ uuid: string }>();

  const { mutate } = useSWRConfig();
  const { data: collection, error: err } = useSWR<
    ICollectionDto,
    ResponseError
  >(`/collection/${route.params.uuid}`, () =>
    CollectionSingleStore.fetchCollectionDetail(route.params.uuid).then(res => res.data)
  );

  if (!collection) {
    return (
      <div className={styles.loadingPage}>
        <LoadingAnimation />
      </div>
    );
  }

  if (err) {
    if (err.response?.data.detail) {
      return <Error text={err.response?.data.detail} />;
    }

    return null;
  }

  if (UIStore.isMobile) {
    return (
      <React.Fragment>
        <Helmet title={`${collection.name} | 收藏夹 | 骰声回响`} />
        <ScrollToTop pathname={`collection/${collection._id}`} />
        <CustomizedFooter visible={false} />
        <CollectionMobileHeader
          collection={collection}
          onUpdate={() => history.push(`/collection/${collection._id}/edit`)}
          reload={(nc) => mutate(`/collection/${route.params.uuid}`, nc, false)}
        />
        <CollectionDetailCard
          className={styles.mobileCollectionList}
          style={{ marginTop: 40 }}
          collection={collection}
        />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="container" style={{ marginTop: 16 }}>
        <Card bordered={false} style={{ marginBottom: 16 }}>
          <CollectionHeader
            collection={collection}
            onUpdate={(nc) =>
              mutate(`/collection/${route.params.uuid}`, nc, false)
            }
          />
        </Card>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16} xl={16}>
            <CollectionDetailCard collection={collection}/>
          </Col>
          <Col xs={0} sm={0} md={8} xl={8}>
            <Card bordered={false}>
              <div>
                创建者：
                {collection.user.nickName}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
});
export default CollectionDetailContainer;
