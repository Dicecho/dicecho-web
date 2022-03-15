import React from "react";
import classNames from 'classnames';
import { observer } from "mobx-react";
import { NavLink, withRouter } from "react-router-dom";
import { Layout, Divider } from "antd";
import styles from "./styles.module.less";
import UIStore, { FooterOptions } from "shared/stores/UIStore";
import { MenuList, MobileMenuList } from "./MenuList";

const { Footer } = Layout;

interface Props {
  footerOptions?: Partial<FooterOptions>;
}

const AppMobileFooter: React.FC<Props> = observer(
  ({ footerOptions = {}, ...props }) => {

  const Default = (        
    <div className={`${styles.mobileFooterMenu} container`}>
      {MobileMenuList.map((item) => (
        <div className={styles.mobileFooterMenuItem} key={item.title}>
          <NavLink
            activeClassName="active"
            to={item.link}
            replace={true}
            className={styles.mobileFooterMenuItemIcon}
            exact={item.exact}
          >
            <item.icon style={{ fontSize: "16px" }} />
          </NavLink>
        </div>
      ))}
    </div>
  )

    return (
      <Footer 
        className={classNames(styles.appMobileFooter, footerOptions.className)}
        style={footerOptions.visible === false ? { display: 'none' } : {}}
      >
        {footerOptions.content || Default}
      </Footer>
    );
  }
);

export default AppMobileFooter;
