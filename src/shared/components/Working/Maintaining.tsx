import React from "react";
import { Error } from '@/shared/components/Empty'
import discordSVG from "@/assets/svg/Discord-Logo-White.svg";
import { Button } from "antd";
import { WeiboOutlined, QqOutlined } from "@ant-design/icons";
import "./style.less";
import "@/shared/effect.scss"

interface IProps {}

const Maintaining: React.FunctionComponent<IProps> = (props) => {

  return (
    <Error text='肥肠抱歉，系统暂时升级维护中'>
      <div style={{ textAlign: 'center', margin: '16px 0 24px' }}>
        通过以下联系方式获得更多信息
      </div>
      <Button 
        href="https://jq.qq.com/?_wv=1027&k=U69VlAni"
        target="_blank"
        block
        // ghost
        type='primary'
        icon={(<QqOutlined />)}
        style={{ marginBottom: 16 }}
      >
        官方qq群
      </Button>
      <Button 
        href="https://weibo.com/u/7575371655"
        target="_blank"
        block
        // ghost
        type='primary'
        icon={(<WeiboOutlined />)}
        style={{ marginBottom: 16 }}
      >
        官博 @骰声回响Dicecho
      </Button>
      <Button 
        href="https://discord.gg/GdV3BMrABX"
        target="_blank"
        block
        // ghost
        type='primary'
        // ghost
        icon={(<img src={discordSVG} width={16} style={{ marginRight: 8 }}/>)}
        style={{ marginBottom: 16 }}
      >
        官方DISCORD服务器
      </Button>
      <iframe 
        style={{ width: 'calc(100% + 20px)', margin: '-10px' }}
        frameBorder="no"
        marginHeight={0}
        marginWidth={0}
        width="100%"
        height={86}
        src="https://music.163.com/outchain/player?type=2&id=25706285&auto=1&height=66"
      />
    </Error>
  )
};

export default Maintaining;
export { Maintaining }
