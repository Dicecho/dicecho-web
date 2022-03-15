import React from "react";
import { observer } from "mobx-react";
import { Link, useHistory } from "react-router-dom";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import UIStore, { BeforeInstallPromptEvent } from '@/shared/stores/UIStore';
import InfiniteScrollWrapper, { ISW } from "@/shared/components/InfiniteScrollWrapper";
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import Empty from "@/shared/components/Empty";
import { HeaderLayout, HeaderBack } from "@/shared/components/Header";
import SettingStore from '@/shared/stores/SettingStore';
import ScrollToTop from "@/shared/components/ScrollToTop";
import { IAdminLog, AdminLogQuery, AdminLogSingleStore } from '../stores/AdminLogStore';
import { InfoCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Row, Col, List, Tooltip, Typography } from "antd";
import AdminLogItem from '../components/AdminLogItem';
import ResponsiveCard from "shared/components/ResponsiveCard";
import styles from "./SettingContainer.module.less";

const { Title } = Typography;


interface IProps {}

const AdminLogContainer: React.FC<IProps> = observer((props) => {
  const history = useHistory();

  return (
    <React.Fragment>
      <ScrollToTop />
      <CustomizedHeader>
        <HeaderLayout left={<HeaderBack />} title="设置" />
      </CustomizedHeader>
      <div className="container" style={{ paddingTop: UIStore.isMobile ? 0 : 32 }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} xl={16}>
            <Title>
              管理公示
            </Title>

            <InfiniteScrollWrapper<IAdminLog, AdminLogQuery>
              fetchApi={(query) => AdminLogSingleStore.fetchAdminLogs(query).then((res) => res.data)}
              empty={(
                <Empty emptyImageUrl={notAuthSVG} emptyText={"这里似乎没有东西"} />
              )}
              renderList={(data) => (
                <List
                  dataSource={data}
                  rowKey='_id'
                  renderItem={(item, index) => <AdminLogItem key={item._id} adminLog={item} />}
                />
              )}
            />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
});
export default AdminLogContainer;
