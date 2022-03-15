import React, { HTMLAttributes, useEffect, useState } from 'react';
import LikeStore from '@/shared/stores/LikeStore';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import AuthStore from '@/shared/stores/AuthStore';
import styles from './styles.module.less';


interface IProps {
  likeCount: number,
  isLiked: boolean,
  targetName: string,
  targetId: string,

  wrapProps?: HTMLAttributes<HTMLDivElement>,
  className?: string,
  usingSimpleStyle?: boolean,

  empty?: React.ReactNode,
  // icon?: React.ReactNode,

  onLike?: () => void,
  onCancel?: () => void,
  openLoginModal?: () => void,
}


const GenericLikeButton: React.FC<IProps> = (props) => {
  const { usingSimpleStyle = true } = props;
  // const { className, ...wrapProps } = props.wrapProps;
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [likeCount, setLikeCount] = useState(props.likeCount);

  useEffect(() => {
    setIsLiked(props.isLiked);
    setLikeCount(props.likeCount);
  }, [props.isLiked, props.likeCount])

  const onLikeClick = () => {
    if (!AuthStore.isAuthenticated) {
      props.openLoginModal && props.openLoginModal();
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
    <div
      {...props.wrapProps}
      className={`${usingSimpleStyle ? styles.simpleLikeBtn : ''} ${isLiked && 'active'} ${props.className || ''}`}
      onClick={onLikeClick}
    >
      {isLiked 
        ? <HeartFilled className={styles.likeIcon} />
        : <HeartOutlined className={styles.likeIcon} />
      }
      <div className={styles.likeCount}>
        {likeCount === 0 && props.empty
          ? props.empty
          : likeCount}
      </div>
    </div>
  );
}

export default GenericLikeButton;
