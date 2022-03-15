import React from "react";
import { Error } from '@/shared/components/Empty'
import "./style.less";
import "@/shared/effect.scss"

interface IProps {
  text?: string;
}

const Working: React.FunctionComponent<IProps> = ({
  text = '肥肠抱歉，您找的页面正在施工中',
  ...props
}) => {

  return (
    <Error text={text} {...props} />
  )
};

export default Working;
export { Working };
