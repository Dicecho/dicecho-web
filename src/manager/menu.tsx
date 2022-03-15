import React from 'react';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import WorkingPage from "@/shared/components/Working";
import { PendantManager } from './containers/PendantManager';

export const MENUS = [
  {
    key: 'all',
    icon: <UserOutlined />,
    title: '未分类',
    items: [
      {
        key: 'argue',
        title: '争议评价管理',
        link: 'argue',
        component: WorkingPage,
      },
      {
        key: 'operation',
        title: '操作记录管理',
        link: 'operation',
        component: WorkingPage,
      }
    ]
  },
  {
    key: 'content',
    icon: <LaptopOutlined />,
    title: '内容管理',
    items: [
      {
        key: 'tags',
        title: '标签管理',
        link: 'tags',
        component: WorkingPage,
        roles: ['tags'],
      },
      {
        key: 'pendant',
        title: '头像框管理',
        link: 'pendant',
        component: PendantManager,
        roles: ['pendant'],
      },
    ]
  },
]

