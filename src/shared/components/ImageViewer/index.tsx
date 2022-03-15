import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { ModalProps } from 'antd/lib/modal';
import styles from './style.module.less';

interface IProps extends ModalProps {
  imgSrcs: Array<string>,
  currentIndex?: number,
  onIndexChange?: (index: number) => void,
}

const ImageViewer: React.FC<IProps> = (props) => {
  const { imgSrcs = [], currentIndex = 0, onIndexChange, ...modalProps} = props
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    if (onIndexChange){
      onIndexChange(index);
    }
  }, [index])

  useEffect(() => {
    setIndex(currentIndex);
  }, [modalProps.visible])

  return (
    <Modal
      className={`${styles.imageViewerModal} ${modalProps.className}`}
      closable={false}
      footer={null}
      maskClosable
      {...modalProps}
    >
      <div
        className={styles.imageMask}
        onClick={(e) => {
          e.stopPropagation()
          if (props.onCancel) props.onCancel(e);
        }}
      >
        <div
          className={`${styles.imageLeftHandle} ${
            styles.imageHandle
          } ${index === 0 && styles.disabled}`}
          onClick={(e) => {
            e.stopPropagation()
            setIndex(index - 1);
          }}
        >
          <LeftCircleOutlined />
        </div>
        <div
          className={`${styles.imageRightHandle} ${
            styles.imageHandle
          } ${index >= imgSrcs.length - 1 && styles.disabled}`}
          onClick={(e) => {
            e.stopPropagation()
            setIndex(index + 1);
          }}
        >
          <RightCircleOutlined />
        </div>

      {/* {imgSrcs.map(src => ( */}
        <img className={styles.image} src={imgSrcs[index]} />
      {/* ))} */}
      </div>
    </Modal>
  )
}

export default ImageViewer
