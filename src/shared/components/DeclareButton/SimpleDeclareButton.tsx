import React, { HTMLAttributes, useEffect, useState } from 'react';
import classnames from 'classnames';
import styles from './styles.module.less';
import { IDeclareProps } from './DeclareButtonGroup';
export { styles as SimpleDeclareButtonStyles }


interface IProps extends IDeclareProps {
  renderPrefix?: (isActive: boolean, count: number) => React.ReactNode,
  renderCount?: (isActive: boolean, count: number) => React.ReactNode,

  wrapProps?: HTMLAttributes<HTMLDivElement>,
  className?: string,
  usingSimpleStyle?: boolean,

  empty?: React.ReactNode,
}


const SimpleDeclareButton: React.FC<IProps> = ({
  onDeclareOrCancel = () => Promise.resolve({
    declareCounts: {},
    declareStatus: {},
  }),
  count = 0,
  isActive = false,
  ...props
}) => {
  const [submitting, setSubmissting] = useState(false);

  return (
    <div
      {...props.wrapProps}
      key={props.attitude}
      className={classnames(styles.simpleLikeBtn, { 'active': isActive }, props.className)}
      onClick={() => {
        if (submitting) {
          return;
        }

        setSubmissting(true)
        onDeclareOrCancel(props.attitude).finally(() => {
          setSubmissting(false)
        })
      }}
    >
      {props.renderPrefix && props.renderPrefix(isActive, count)}

      {props.renderCount ?
        props.renderCount(isActive, count) :
        <div className={styles.likeCount}> 
          {count}
        </div>
       }
    </div>
  );
}

export { SimpleDeclareButton };
