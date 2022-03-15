import React, { HTMLAttributes } from "react";
import { observer } from "mobx-react";
import UIStore from '@/shared/stores/UIStore';

interface IProps extends HTMLAttributes<HTMLDivElement> {
  mobileAvaliable?: boolean;
  pcAvaliable?: boolean;
}

const ResponsiveContainer: React.FC<IProps> = observer(({
  mobileAvaliable = true,
  pcAvaliable = true,
  children,
  className = '',
  ...props
}) => {

  const hasContainer = UIStore.isMobile ? mobileAvaliable : pcAvaliable;

  return (
    <div className={`${hasContainer ? 'container' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
});

export default ResponsiveContainer;
