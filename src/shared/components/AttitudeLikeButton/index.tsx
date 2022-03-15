import React, { HTMLAttributes, useEffect, useState } from 'react';
import LikeStore from '@/shared/stores/LikeStore';
import {
  LikeFilled,
  LikeOutlined,
  DislikeFilled,
  DislikeOutlined,
} from '@ant-design/icons';
import AuthStore from '@/shared/stores/AuthStore';
import UIStore from '@/shared/stores/UIStore';
import styles from './styles.module.less';


export enum LikeAttitude {
  like = 0,
  dislike = 1,
}

interface IProps {
  likeCount: number,
  isLiked: boolean,
  isDisliked: boolean,
  targetName: string,
  targetId: string,

  wrapProps?: HTMLAttributes<HTMLDivElement>,
  className?: string,
  usingSimpleStyle?: boolean,

  empty?: React.ReactNode,
  // icon?: React.ReactNode,

  onLike?: () => void,
  onDisLike?: () => void,
  onCancel?: () => void,
}


const AttitudeLikeButton: React.FC<IProps> = (props) => {
  const { usingSimpleStyle = true } = props;
  // const { className, ...wrapProps } = props.wrapProps;
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [isDisliked, setIsDislike] = useState(props.isDisliked);
  const [likeCount, setLikeCount] = useState(props.likeCount);

  useEffect(() => {
    setIsLiked(props.isLiked);
    setLikeCount(props.likeCount);
    setIsDislike(props.isDisliked);
  }, [props.isLiked, props.likeCount, props.isDisliked])

  const onLikeClick = () => {
    if (!AuthStore.isAuthenticated) {
      UIStore.openLoginModal();
      return;
    }

    if (isDisliked) {
      setLikeCount(likeCount + 1)
      setIsLiked(true)
      setIsDislike(false)
      LikeStore.likeOrCancel(
        props.targetName,
        props.targetId,
      ).catch(() => {
        setLikeCount(likeCount - 1)
        setIsLiked(false)
        setIsDislike(true)
      });
      return;
    }
  
    changeLikeState();
    LikeStore.likeOrCancel(
      props.targetName,
      props.targetId,
      isLiked,
    ).catch(() => {
      changeLikeState();
    });
  };
  
  const onDislikeClick = () => {
    if (!AuthStore.isAuthenticated) {
      UIStore.openLoginModal();
      return;
    }

    if (isLiked) {
      setLikeCount(likeCount - 1)
      setIsLiked(false)
      setIsDislike(true)
      LikeStore.dislikeOrCancel(
        props.targetName,
        props.targetId,
      ).catch(() => {
        setLikeCount(likeCount + 1)
        setIsLiked(true)
        setIsDislike(false)
      });
      return;
    }

    setIsDislike(!isDisliked)
    LikeStore.dislikeOrCancel(
      props.targetName,
      props.targetId,
      isDisliked,
    ).catch(() => {
      setIsDislike(!isDisliked)
    });
    return;
  }

  const changeLikeState = () => {
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    setIsLiked(!isLiked)

    if (isLiked) {
      props.onCancel && props.onCancel();

      return;
    }
    props.onLike && props.onLike();
  };

  return (
    <React.Fragment>
      <div
        {...props.wrapProps}
        className={`${usingSimpleStyle ? styles.simpleLikeBtn : ''} ${isLiked && 'active'} ${props.className || ''}`}
        onClick={onLikeClick}
      >
        {isLiked 
          ? <LikeFilled className={styles.likeIcon} style={{ marginRight: 8 }} />
          : <LikeOutlined className={styles.likeIcon} style={{ marginRight: 8 }} />
        }
        <div className={styles.likeCount}>
          {likeCount === 0 && props.empty
            ? props.empty
            : likeCount}
        </div>
      </div>
      <div
        {...props.wrapProps}
        className={`${usingSimpleStyle ? styles.simpleLikeBtn : ''} ${isDisliked && 'active'} ${props.className || ''}`}
        onClick={onDislikeClick}
      >
        {isDisliked 
          ? <DislikeFilled className={styles.likeIcon} />
          : <DislikeOutlined className={styles.likeIcon} />
        }
      </div>
    </React.Fragment>
  );
}

export default AttitudeLikeButton;
