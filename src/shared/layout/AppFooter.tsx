import React from 'react';
import { observer } from 'mobx-react';
import { Layout, Divider } from 'antd';
import { Link } from 'react-router-dom';
import logo from '@/assets/img/logo.png'
import './styles.less';

const { Footer } = Layout;

@observer
class AppFooter extends React.Component<any, any> {
  render() {
    let cpYear = new Date();

    return (
      <Footer className="app-footer">
        <div className="container footer-wrapper-content">
          <div className="left-wrapper">
            <Link to="/">
              <img src={logo} className="brand app-footer-logo" />
            </Link>
            <div className="content-wrapper">
              {/* <div className="select-wrapper">
                <Link to="/">
                  首页
                </Link>
                <Divider type='vertical'/>
                <Link to="/course/">
                  课程
                </Link>
                <Divider type='vertical'/>
                <a href="/">联系我们</a>
              </div> */}
              <div className="copy-right" style={{ marginBottom: 4 }}>
                Copyright &copy; 2021 Dicecho.Inc &nbsp;
              </div>

              <a href='https://beian.miit.gov.cn/' target='_blank' style={{ marginBottom: 4 }}>
                浙ICP备2021004742号-1
              </a>
              <div>
                <img src="https://file.dicecho.com/mod/600af94a44f096001d6e49df/2021042917005832.png" style={{ marginRight: 8 }}/>
                <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902002908">
                  浙公网安备 33010902002908号
                </a>
              </div>
            </div>
          </div>
        </div>
      </Footer>
    );
  }
}

export default AppFooter;
