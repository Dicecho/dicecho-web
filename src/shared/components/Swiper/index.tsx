import React, { useRef, useState } from "react";
import { Swiper as InnerSwiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation, SwiperOptions } from "swiper/core";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";

SwiperCore.use([Pagination, Navigation]);

interface IProps extends SwiperOptions {

}

const Swiper: React.FC<IProps> = ({ children, ...props }) => {
  return (
    <InnerSwiper {...props}>
      {children}
    </InnerSwiper>
  )
}

export { Swiper, SwiperSlide } 