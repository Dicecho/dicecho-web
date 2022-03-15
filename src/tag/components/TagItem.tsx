import React, { HTMLAttributes } from 'react';
import { observer } from 'mobx-react';
import { Card, Typography, Tag, Avatar } from 'antd';
import { useHistory, Link } from "react-router-dom";
import { IModDto } from '@/interfaces/shared/api';
import moment from 'moment';
import qs from 'qs';
import styles from './TagItem.module.less';

const { Paragraph, Text } = Typography;

interface IProps extends Omit<HTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  tag: string,
  unlink?: boolean,
}

const TagItem: React.FC<IProps> = observer(({ 
  tag,
  className = '',
  unlink = false,
  ...props
}) => {
  const history = useHistory();

  if (unlink) {
    return (
      <span className={`${styles.tag} ${className}`} {...props}>
        {tag}
      </span>
    )
  }

  return (
    <Link to={`/tag/${tag}`} className={`${styles.tag} ${className}`} {...props}>
      {tag}
    </Link>
  );
});

export default TagItem;
