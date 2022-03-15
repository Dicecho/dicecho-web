import React, { HTMLAttributes } from "react";
import { observer } from "mobx-react";
import styles from "./styles.module.less";

interface IProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  left?: React.ReactNode;
  leftProps?: HTMLAttributes<HTMLDivElement>;
  title?: React.ReactNode;
  titleProps?: HTMLAttributes<HTMLDivElement>;
  right?: React.ReactNode;
  rightProps?: HTMLAttributes<HTMLDivElement>;
}

const HeaderLayout: React.FC<IProps> = observer(({
  className,
  left,
  leftProps,
  title,
  titleProps,
  right,
  rightProps,
  ...props
}) => {
  return (
    <div className={`container ${className} ${styles.headerLayout}`} {...props}>
      {left &&
        <div className={styles.headerLayoutLeft} {...leftProps}>
          {left}
        </div>
      }
      {title &&
        <div className={styles.headerLayoutTitle} {...titleProps}>
          {title}
        </div>
      }
      {right &&
        <div className={styles.headerLayoutRight} {...rightProps}>
          {right}
        </div>
      }
    </div>
  )
});

export { HeaderLayout };
