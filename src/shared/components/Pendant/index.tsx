import React, { HTMLAttributes } from "react";
import classnames from 'classnames';
import styles from "./Pendant.module.less";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  url?: string;
}

const Pendant: React.FunctionComponent<IProps> = ({
  url = 'https://file.dicecho.com/mod/600af94a44f096001d6e49df/2021122311220431.png',
  children,
  ...wrapperProps
}) => {
  return (
    <span {...wrapperProps} className={classnames(styles.avatarWrapper, wrapperProps?.className)}>
      {url !== '' &&
        <span className={styles.pendant} style={{ backgroundImage: `url(${url})` }} />
      }
      {children}
    </span>
  );
};

export { Pendant };
export default Pendant;
