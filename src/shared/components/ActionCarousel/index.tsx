import React, {
  Children,
  HTMLAttributes,
  useRef,
  useState,
} from "react";
import { observer } from "mobx-react";
import { Carousel } from "antd";
import { CarouselProps } from "antd/lib/carousel";
import { CarouselRef } from "antd/lib/carousel";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import styles from "./styles.module.less";

interface IProps extends CarouselProps {
  wrapperProps?: Partial<HTMLAttributes<HTMLDivElement>>;
}

const ActionCarousel: React.FC<IProps> = observer(
  ({ wrapperProps, children, ...props }) => {
    const CarouselRef = useRef<CarouselRef>(null);
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

    return (
      <div {...wrapperProps} style={{ position: "relative", ...wrapperProps?.style }}>
        <div
          className={`${styles.carouselLeftHandle} ${
            styles.carouselHandle
          } ${albumIndex === 0 && styles.disabled}`}
          onClick={() => prev()}
        >
          <LeftCircleOutlined />
        </div>
        <div
          className={`${styles.carouselRightHandle} ${
            styles.carouselHandle
          } ${albumIndex >= Children.count(children) - 1 && styles.disabled}`}
          onClick={() => next()}
        >
          <RightCircleOutlined />
        </div>
        <Carousel
          ref={CarouselRef}
          dots={false}
          style={{ marginBottom: 8 }}
          slickGoTo={albumIndex}
          beforeChange={(_, next) => setAlbumIndex(next)}
          {...props}
        >
          {children}
        </Carousel>
      </div>
    );
  }
);

export default ActionCarousel;
