import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Carousel, Card, Image } from "antd";
import { CarouselRef } from "antd/lib/carousel";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import Scrollbars from "react-custom-scrollbars";
import styles from "./ModuleAlbum.module.less";

interface IProps {
  className?: string;
  imageUrls: Array<string>;
  style?: React.CSSProperties;
}

const ModuleAlbum: React.FC<IProps> = observer(
  ({ className, style, imageUrls }) => {
    const CarouselRef = useRef<CarouselRef>(null);
    const PreviewScrollRef = useRef<Scrollbars>(null);
    const [albumIndex, setAlbumIndex] = useState(0);

    const goto = (index: number) => {
      if (CarouselRef.current) {
        CarouselRef.current.goTo(index);
      }
    };

    const prev = () => {
      if (CarouselRef.current) {
        CarouselRef.current.prev();
      }
    };

    const next = () => {
      if (CarouselRef.current) {
        CarouselRef.current.next();
      }
    };

    // useEffect(() => {
    //   if (!PreviewScrollRef.current) {
    //     return;
    //   }

    //   PreviewScrollRef.current.scrollLeft(108 * albumIndex)
    // }, [albumIndex])

    return (
      <React.Fragment>
        <div className={className} style={style}>
          <div style={{ position: "relative" }}>
            <div
              className={`${styles.ModuleAlbumLeftHandle} ${
                styles.ModuleAlbumHandle
              } ${albumIndex === 0 && styles.disabled}`}
              onClick={() => prev()}
            >
              <LeftCircleOutlined />
            </div>
            <div
              className={`${styles.ModuleAlbumRightHandle} ${
                styles.ModuleAlbumHandle
              } ${albumIndex >= imageUrls.length - 1 && styles.disabled}`}
              onClick={() => next()}
            >
              <RightCircleOutlined />
            </div>
            <Image.PreviewGroup>
              <Carousel
                ref={CarouselRef}
                dots={false}
                style={{ marginBottom: 8 }}
                slickGoTo={albumIndex}
                beforeChange={(_, next) => {
                  setAlbumIndex(next);
                  if (!PreviewScrollRef.current) {
                    return;
                  }

                  PreviewScrollRef.current.scrollLeft(108 * next);
                }}
              >
                {imageUrls.map((url) => (
                  <div className={styles.ModuleAlbumItem} key={url}>
                    <Image wrapperClassName={styles.ModuleAlbumImage} src={url} />
                  </div>
                ))}
              </Carousel>
            </Image.PreviewGroup>
          </div>
          {imageUrls.length > 1 && (
            <Scrollbars
              autoHide
              renderThumbVertical={() => <div className="custom-scroll" />}
              style={{ height: 80 }}
              ref={PreviewScrollRef}
              id="album-preview-scroll"
              renderView={() => (
                <div className={styles.albumPreviewScrollView} />
              )}
            >
              {imageUrls.map((url, index) => (
                <div
                  key={url}
                  style={{ backgroundImage: `url(${url})` }}
                  id={`album-preview-${index}`}
                  className={`${styles.ModuleAlbumPreviewItem} ${
                    index === albumIndex && styles.active
                  }`}
                  onClick={() => {
                    if (index === albumIndex) {
                      return;
                    }
                    goto(index);
                  }}
                />
              ))}
            </Scrollbars>
          )}
        </div>
      </React.Fragment>
    );
  }
);

export default ModuleAlbum;
