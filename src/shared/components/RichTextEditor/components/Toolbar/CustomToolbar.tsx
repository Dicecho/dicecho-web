import React, { HTMLAttributes } from 'react'
import classnames from 'classnames';
import { ToolbarButtons } from './Buttons';
import styles from './CustomToolbar.module.less';

interface IProps extends HTMLAttributes<HTMLDivElement> {
  id?: string;
}


const CustomToolbar: React.FC<IProps> = (props) => {
  return (
    <div {...props} className={classnames(styles.toolbar, props.className)}>
      <ToolbarButtons id={props.id} />
    </div>
  )
}

export { CustomToolbar }
