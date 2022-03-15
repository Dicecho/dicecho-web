import React, { HTMLAttributes, HtmlHTMLAttributes, useState } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import { Input } from "antd";
import { InputProps } from 'antd/lib/input';
import UIStore from 'shared/stores/UIStore';
import styles from "./styles.module.less";

interface IProps extends InputProps {
}

const HeaderSearch: React.FC<IProps> = observer(({
  className,
  ...props
}) => {
  const history = useHistory();
  // const [search, setSearch] = useState("");

  return (
    <Input.Search
      bordered={false}
      // prefix={<SearchOutlined />}
      placeholder="搜索模组/标签/帖子/用户"
      className={`${styles.searchInput} ${className}`}
      defaultValue={UIStore.searchText}
      value={UIStore.searchText}
      onChange={(e) => UIStore.setSearchText(e.target.value)}
      onSearch={(value) => {
        history.push(`/search?keyword=${value}`)
      }}
      {...props}
    />
  )
});

export { HeaderSearch };
