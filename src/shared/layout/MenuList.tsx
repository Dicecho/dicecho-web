import React from 'react';
import {
  VideoCameraOutlined,
  SaveOutlined,
  HomeOutlined,
  ReadOutlined,
  MessageOutlined,
  UserOutlined,
  createFromIconfontCN,
} from "@ant-design/icons";

export type MenuItem = {
  title: string;
  link: string;
  icon: React.ForwardRefExoticComponent<any>;
  exact?: boolean;
};

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1933167_4czitg0qw7d.js', // 在 iconfont.cn 上生成
});

function makeIcon(type: string): React.ForwardRefExoticComponent<any> {
  return React.forwardRef<HTMLInputElement, any>((props, ref) => {
    return <MyIcon {...props} type={type} ref={ref} />;
  });
}

export const MenuList: Array<MenuItem> = [
  {
    title: "模组",
    link: "/module",
    icon: ReadOutlined,
  },
  {
    title: "讨论区",
    link: "/forum",
    icon: MessageOutlined,
  },
  {
    title: "视频",
    link: "/replay",
    icon: VideoCameraOutlined,
  },
  // {
  //   title: "规则书",
  //   link: "/rule",
  //   icon: BookOutlined,
  // },
];


export const MobileMenuList: Array<MenuItem> = [
  {
    title: "主页",
    link: "/",
    icon: HomeOutlined,
    exact: true,
  },
  {
    title: "模组",
    link: "/module",
    icon: ReadOutlined,
  },
  {
    title: "讨论区",
    link: "/forum",
    icon: MessageOutlined,
  },
  {
    title: "replay",
    link: "/replay",
    icon: VideoCameraOutlined,
  },
  {
    title: "我的",
    link: "/account",
    icon: UserOutlined,
  },
];

