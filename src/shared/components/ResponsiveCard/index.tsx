import React from "react";
import { observer } from "mobx-react";
import { Card } from "antd";
import { CardProps } from 'antd/lib/card'
import UIStore from '@/shared/stores/UIStore';

interface IProps extends CardProps {}

const ResponsiveCard: React.FC<IProps> = observer(({
  children,
  ...props
}) => {
  if (UIStore.isMobile) {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    )
  }

  return (
    <Card {...props}>
      {children}
    </Card>
  )
});

export default ResponsiveCard;
