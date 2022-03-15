import React from "react";
import { observer } from "mobx-react";
import diceAni from '@/assets/animation/dice.png';
import styled, { keyframes, css } from "styled-components";
// import styles from './LoadingAnimation.module.less';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
}

const LoadingAnimation: React.FunctionComponent<IProps> = observer(({
  width = 120,
  ...props
}) => {
  const loading = keyframes`
    from { background-position-x: left; }
    to { background-position-x: -${width * 50}px; }
  `;

  const animation = () =>
  css`${loading} 1.4s steps(50) infinite`

  const StyledWrapper = styled.div`
    height: ${width}px;
    width: ${width}px;
    animation: ${animation};
    background-image: url(${diceAni});
    background-size: cover;
  `;

  return (
    <StyledWrapper {...props}/>
    // <div style={{ ...styles, ...props.style}} {...props} />
  )

  // return (
  //   <video {...props} loop autoPlay playsInline muted>
  //     <source src={loadingAni} type="video/webm"/>
  //   </video>
  // );
});

export default LoadingAnimation;
