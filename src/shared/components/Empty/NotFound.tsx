import React from "react";
import Empty from "@/shared/components/Empty";
import { WorkingAnimation } from '@/shared/components/Animation';
import "./style.less";
import "@/shared/effect.scss"

interface IProps {
  text?: string;
  padding?: number
}

const Error: React.FunctionComponent<IProps> = ({
  text = '好像哪里出现了错误',
  padding = 16,
  ...props
}) => {

  return (
    <Empty padding={padding}>
      <WorkingAnimation style={{ maxWidth: 400 }} />
      <span className="working-text glitch" data-text={text}>
        {text}
      </span>
      {props.children}
    </Empty>
  )
};

export default Error;
export { Error }
