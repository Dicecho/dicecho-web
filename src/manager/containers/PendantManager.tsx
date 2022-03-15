
import React, { Component, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import {
  useRouteMatch,
  NavLink,
  Switch,
  Redirect,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import { PageHeader, List, Card, Avatar, Skeleton, Button, Modal } from 'antd';
import { usePendant, createPendant } from '@/shared/hooks';
import { openPendantSendModal } from '../components/PendantSendModal';

import { Pendant } from "@/shared/components/Pendant";
import { PendantCreateForm } from '../components/PendantCreateForm';


export const PendantManager: React.FC<any> = () => {
  const route = useRouteMatch();
  const history = useHistory();
  const { data, error, isLoading, refresh } = usePendant();


  return (
    <React.Fragment>
      <PageHeader
        className="site-page-header"
        title="头像框管理"
        // breadcrumb={{ routes }}
        // subTitle="This is a subtitle"
        ghost={false}
      />
      <div style={{ padding: '24px' }}>
        <Card bordered={false}>
          <Switch>
            <Route exact path={`${route.url}`} component={() => (
              <>
                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                  <Link to={`${route.url}/create`}>
                    <Button type='primary'>
                      创建新挂饰
                    </Button>
                  </Link>
                </div>
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={item => (
                    <List.Item
                      key={item._id}
                      actions={[
                        // <a>编辑</a>,
                        <a onClick={() => openPendantSendModal({ pendantId: item._id, pendantUrl: item.url })}>
                          发送给用户
                        </a>
                      ]}
                    >
                      <Skeleton avatar title={false} loading={isLoading} active>
                        <List.Item.Meta
                          avatar={
                            <Pendant url={item.url}>
                              <Avatar 
                                src={'/avatars/preview'}
                                size={32}
                              />
                            </Pendant>
                          }
                          title={item.name}
                        />
                        <div>{item.url}</div>
                      </Skeleton>
                    </List.Item>
                  )}
                />
              </>
              )}  
            />
            <Route exact path={`${route.url}/create`} component={() => (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Link to={`${route.url}`}>
                    <Button type='primary'>
                      返回
                    </Button>
                  </Link>
                </div>
                <PendantCreateForm 
                  onSubmit={(dto) => {
                    return createPendant(dto).then(() => {
                      history.push(route.url)
                      refresh();
                    })
                  }}
                >
                  <Button type='primary' htmlType='submit'>
                    创建新挂饰
                  </Button>
                </PendantCreateForm>
              </>
              )}
            />
            <Redirect to={`${route.url}`} />
          </Switch>
        </Card>
      </div>
    </React.Fragment>
  );
};
