import React from "react";
import Lottie, { LottieProps } from 'lottie-react-web'
import workingAni from "@/assets/animation/working.json";

interface IProps extends Partial<LottieProps> {}

const WorkingAnimation: React.FunctionComponent<IProps> = (props) => {
  const { options, style, ...lottieProps } = props;

  return (
    <Lottie
      options={{
        ...options,
        animationData: workingAni,
        loop: true,
      }}
      style={{ marginLeft: -30, ...style }}
      {...lottieProps}
    />
  )
};

export default WorkingAnimation;
export { WorkingAnimation }
