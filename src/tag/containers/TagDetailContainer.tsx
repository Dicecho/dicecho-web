import React, { useEffect, useState } from "react";
import {
  Button,
  Empty,
  Card,
  message,
  Typography,
} from "antd";
import {
  useRouteMatch,
  NavLink,
  Switch,
  Redirect,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import AuthStore from "@/shared/stores/AuthStore";
import newWorkingSVG from "@/assets/svg/newWorking.svg";
import { AxiosError } from "axios";
import { TagErrorCode } from "@/interfaces/shared/errorcode/tag";
import LoadableButton from "@/shared/components/LoadableButton";
import ScrollToTop from "@/shared/components/ScrollToTop";
import TagHome from "./TagHome";
import TagModules from "./TagModules";
import TagTopics from "./TagTopics";
import TagEdit from "./TagEdit";
import TagStore, { ITag } from "@/shared/stores/TagStore";
import { observer } from "mobx-react";
import styles from "./TagDetailContainer.module.less";

const { Title, Paragraph } = Typography;

const TagDetailContainer: React.FunctionComponent = observer(() => {
  const history = useHistory();
  const route = useRouteMatch<{ name: string }>();
  const [tag, setTag] = useState<undefined | ITag>(undefined);
  const [error, setError] = useState<undefined | AxiosError>(undefined);

  useEffect(() => {
    TagStore.fetchTagDetail(route.params.name)
      .then((res) => {
        setTag(res.data);
      })
      .catch((err: AxiosError) => {
        setError(err);
      });
  }, [route.params.name]);

  if (error) {
    if (error.response?.data.code === TagErrorCode.NOT_FOUND_TAG) {
      return (
        <Empty
          image={newWorkingSVG}
          imageStyle={{ height: 180 }}
          description="您找的标签不存在"
        >
          <LoadableButton
            type="primary"
            onSubmit={() =>
              TagStore.createTag(route.params.name).then((res) => {
                setTag(res.data);
                setError(undefined);
              })
            }
          >
            立即创建 {route.params.name}
          </LoadableButton>
        </Empty>
      );
    }

    const message = error.response?.data.detail || "似乎出现了问题";

    if (error.response?.data.detail) {
      return (
        <Empty
          image={newWorkingSVG}
          imageStyle={{ height: 180 }}
          description={message}
        >
          <Button href={route.url} type="primary">
            刷新
          </Button>
        </Empty>
      );
    }
  }

  if (!tag) {
    return null;
  }

  const tabs = [
    {
      link: "",
      title: `主页`,
      exact: true,
    },
    {
      link: "modules",
      title: `模组 (${tag.modCount})`,
    },
    // {
    //   link: "forum",
    //   title: `讨论帖 (${tag.topicCount})`,
    // },
  ];

  return (
    <React.Fragment>
      <Helmet title={`${tag.name} | 标签 | 骰声回响`} />
      <ScrollToTop pathname={`tag/${route.params.name}`} />
      <div className="container" style={{ paddingTop: 32, marginBottom: 32 }}>
        <Card
          bordered={false}
          className={styles.header}
          style={{ marginBottom: 16 }}
        >
          <Title level={3}># {tag.name} </Title>
          {tag.alias.length > 0 && (
            <div>
              别名：
              {tag.alias.map(
                (alias, index) =>
                  `${alias}${index !== tag.alias.length - 1 ? "、" : ""}`
              )}
            </div>
          )}
          <Paragraph>{tag.description}</Paragraph>

          <div className={styles.headerTabs}>
            {tabs.map((tab) => (
              <NavLink
                key={tab.link}
                exact={tab.exact}
                activeClassName={styles.headerTabActive}
                to={tab.link === "" ? route.url : `${route.url}/${tab.link}`}
                className={styles.headerTab}
              >
                <span className={styles.headerTabText}>{tab.title}</span>
              </NavLink>
            ))}

            {AuthStore.checkRole("superuser") && (
              <Link
                to={`/tag/${route.params.name}/edit`}
                style={{ marginLeft: "auto", marginTop: -8 }}
              >
                <Button type="primary" ghost block>
                  编辑
                </Button>
              </Link>
            )}
          </div>
        </Card>

        <Switch>
          <Route exact path={`${route.url}`}>
            <TagHome tag={tag} />
          </Route>
          <Route path={`${route.url}/modules`}>
            <TagModules tag={tag} />
          </Route>
          <Route path={`${route.url}/forum`}>
            <TagTopics tag={tag} />
          </Route>
          <Route path={`${route.url}/edit`}>
            <TagEdit
              tag={tag}
              onSave={(dto) =>
                TagStore.updateTag(tag.name, dto).then((res) => {
                  setTag(res.data);
                  message.success("更新成功");
                  history.push(route.url);
                })
              }
            />
          </Route>
          <Redirect to={`${route.url}`} />
        </Switch>
      </div>
    </React.Fragment>
  );
});
export default TagDetailContainer;
