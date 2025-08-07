"use client";

import { Mousewheel, Navigation, Scrollbar, Thumbs } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./JogosGaleria.module.css";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";

type JogosGaleriaProps = {
  galeria: string[];
  dimH?: number;
  aspectRatio?: number;
};

export default function JogosGaleria({
  galeria,
  dimH = 200,
  aspectRatio = 100,
}: JogosGaleriaProps) {
  const swiperRef = useRef<SwiperClass>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    galeria && galeria.length > 0 && (
      <div className={styles["galeria-div"]}>
        <Swiper
          modules={[Navigation, Thumbs]}
          autoplay
          slidesPerView={1}
          thumbs={{ swiper: thumbsSwiper }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
          }}
          className={`
            ${styles["swiper"]}
            ${galeria.length === 1 ? styles["swiper-one"] : ""}
          `}
        >
          {galeria.map((item, index) => (
            <SwiperSlide
              key={index}
              className={styles["swiper-slider"]}
              style={{
                maxHeight: galeria.length === 1 
                  ? dimH*1.2 
                  : dimH,
                aspectRatio: aspectRatio,
              }}
            >
              <Image
                src={item}
                alt={`Galeria imagem : ${index + 1}`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </SwiperSlide>
          ))}
          {galeria.length > 1 && (
            <div className={styles["control-div"]}>
              <TiChevronLeft 
                onClick={() => swiperRef.current?.slidePrev()}
                className={`
                  ${styles["control-prev"]} 
                  ${activeIndex == 0 ? "g-desativado" : ""}`
                }
                size={20} 
              />            
              <TiChevronRight 
                onClick={() => swiperRef.current?.slideNext()}
                className={`
                  ${styles["control-next"]} 
                  ${activeIndex == galeria.length - 1 ? "g-desativado" : ""}
                `}
                size={20}
              />  
            </div>
          )}
        </Swiper>

        {/* Thumbs */}
        {galeria.length > 1 && (
          <Swiper
            modules={[Thumbs, Scrollbar, Mousewheel]}
            direction="vertical"
            watchSlidesProgress
            scrollbar={{ draggable: true }}
            mousewheel={true}
            slidesPerView={2}
            spaceBetween={5}
            freeMode={true}
            onSwiper={setThumbsSwiper}
            className={styles["paginator"]}
          >
            {galeria.map(({ id, img }) => (
              <SwiperSlide key={id} className={styles["paginator-slide"]}>
                <Image
                  src={img}
                  alt={`Imagem ${id}`}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    )
  );
}
