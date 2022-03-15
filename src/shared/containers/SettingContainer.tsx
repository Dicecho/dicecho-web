import React from "react";
import { observer } from "mobx-react";
import { Link, useHistory } from "react-router-dom";
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import { HeaderLayout, HeaderBack } from "@/shared/components/Header";
import SettingStore from '@/shared/stores/SettingStore';
import ScrollToTop from "@/shared/components/ScrollToTop";
import { InfoCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Row, Col, Switch, Tooltip } from "antd";
import ResponsiveCard from "shared/components/ResponsiveCard";
import styles from "./SettingContainer.module.less";


interface IProps {}

const SettingContainer: React.FC<IProps> = observer((props) => {
  const history = useHistory();

  return (
    <React.Fragment>
      <ScrollToTop />
      <CustomizedHeader>
        <HeaderLayout left={<HeaderBack />} title="设置" />
      </CustomizedHeader>
      <div className="container">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} xl={16}>
            <ResponsiveCard bordered={false} style={{ marginTop: 16 }} title='设置' >
              <div className={styles.settingItem}>
                开启评分
                <Switch
                  style={{ marginLeft: "auto" }}
                  checked={SettingStore.rateScoreAvailable}
                  onChange={(value) => SettingStore.setRateScoreAvailable(value)}
                />
              </div>
              <div className={styles.settingItem}>
                开启评价
                <Switch
                  style={{ marginLeft: "auto" }}
                  checked={SettingStore.rateAvailable}
                  onChange={(value) => SettingStore.setRateAvailable(value)}
                />
              </div>
              <div className={styles.settingItem}>
                <span style={{ marginRight: 4 }}>APP模式</span>
                <Tooltip overlay='在使用手机浏览器”添加到首屏“功能时开启可以获得更佳体验'>
                  <InfoCircleOutlined />
                </Tooltip>
                
                <Switch
                  style={{ marginLeft: "auto" }}
                  checked={SettingStore.mode === 'application'}
                  onChange={(isApp) => {
                    if (isApp) {
                      history.push('/#/')
                    }
                    SettingStore.setMode(isApp ? 'application' : 'browser')
                  }}
                />
              </div>
              <div className={`${styles.settingItem}`}>
                更改主题
                <div style={{ marginLeft: "auto" }}>
                  <span className="secondary-text">暂不可用</span>
                  <RightOutlined style={{ marginLeft: 4 }} />
                </div>
              </div>
              <Link to="/notice/about" className="custom-link">
                <div className={styles.settingItem}>
                  关于骰声回响
                  <RightOutlined style={{ marginLeft: "auto" }} />
                </div>
              </Link>
            </ResponsiveCard>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
});
export default SettingContainer;
