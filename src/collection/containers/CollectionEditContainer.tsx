import React, { useState, useEffect }  from "react";
import { observer } from "mobx-react";
import { useHistory, useRouteMatch, Route } from "react-router-dom";
import AuthStore from '@/shared/stores/AuthStore';
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import { HeaderLayout, HeaderBack } from "@/shared/components/Header";
import ScrollToTop from "@/shared/components/ScrollToTop";
import { LoadingAnimation } from "@/shared/components/Loading";
import { ResponseError } from "@/interfaces/response";
import { Error } from "@/shared/components/Empty";
import { message, Card } from 'antd';
import { CollectionSingleStore, ICollectionDto } from '../store/CollectionStore'
import { useIsMounted } from "react-tidy";
import CollectionUpdateForm from '../components/CollectionUpdateForm';
import styles from './CollectionEditContainer.module.less'

interface IProps {}

const CollectionEditContainer: React.FC<IProps> = observer((props) => {
  const history = useHistory();
  const route = useRouteMatch<{ uuid: string }>();
  const [collection, setCollection] = useState<ICollectionDto>();
  const isMounted = useIsMounted();
  const [err, setErr] = useState<ResponseError>();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    CollectionSingleStore.fetchCollectionDetail(route.params.uuid)
      .then((res) => {
        setCollection(res.data);
      })
      .catch((err) => {
        setErr(err);
      })
      .finally(() => {
        if (!isMounted()) {
          return;
        }
        setInitialized(true);
      });
  }, [route.params.uuid])

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


  if (!collection) {
    return null;
  }

  const canEdit = collection.user._id === AuthStore.user._id;

  if (!canEdit) {
    return (
      <Error text={'您无法编辑这个收藏夹'}/>
    )
  }

  return (
    <React.Fragment>
      <ScrollToTop />
      <CustomizedHeader>
        <HeaderLayout left={<HeaderBack />} title="编辑收藏夹" />
      </CustomizedHeader>
      <Card bordered={false}>
        <CollectionUpdateForm 
          collection={collection}
          onSave={(dto) => CollectionSingleStore.updateCollection(collection._id, dto).then((res) => {
            message.success('更新成功')
            history.goBack();
          })}
        />
      </Card>
    </React.Fragment>
  );
});
export default CollectionEditContainer;
