import React, { useState } from "react";
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';

interface Props extends Omit<ButtonProps, 'onClick'> {
  onSubmit: (e: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<any>;
}

const LoadableButton: React.FunctionComponent<Props> = (props) => {
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setLoading(true);
    props.onSubmit(e).finally(() => {
      setLoading(false);
    });
  }

  return (
    <Button
      {...props}
      loading={loading || props.loading}
      onClick={(event) => handleClick(event)}
    >
      {props.children}
    </Button>
  )
}

export default LoadableButton