import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import LoadingAnimation from './LoadingAnimation';
import styles from './appLoadingPage.module.less';

interface IProps {
}

const LoadingPage: React.FunctionComponent<IProps> = observer((props) => {
  const [count, setCount] = useState(0);
  
  const contentSequence = ['主持人暗骰中', '主持人暗骰中.', '主持人暗骰中..', '主持人暗骰中...', '主持人暗骰中....']

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count => (count + 1) % contentSequence.length);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.appLoadingContainer}>
      <LoadingAnimation className={styles.appLoadingAnimation}/>
      <div className={styles.appLoadingText}>
        {contentSequence[count]}
      </div>
    </div>
  );
});

export default LoadingPage;

export { LoadingAnimation };
