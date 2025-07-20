"use client";

import { useEffect, useRef, useState } from "react";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import styles from "./carrossel.module.css";

export default function Carrossel() {
  const swiperRef = useRef<SwiperClass>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [expansor, setExpansor] = useState(false);
  const slideMax = 5;

  const [imgs, setImgs] = useState<{ id: string; img: string }[] | null>();

  const dimW = 900;
  const dimH = 600;

  useEffect(() => {
    const tmp: { id: string; img: string }[] = [];

    for (let i = 1; i < 6; i++) {
      tmp.push({
        id: `${i}`,
        img: `https://picsum.photos/${dimW}/${dimH}?random=${i}`,
      });
    }

    setImgs(tmp);
  }, []);

  return imgs ? (
    <>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        pagination={{
          el: paginationRef.current!,
          clickable: true,
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
          swiper.params.pagination.el = paginationRef.current;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
      >
        {imgs.map(({ id, img }) => (
          <SwiperSlide
            key={id}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Image
              src={img}
              alt="TESTE"
              width={dimW}
              height={dimH}
              layout="intrinsic"
              style={{ maxHeight: "400px", width: "auto" }}
            />
          </SwiperSlide>
        ))}
        <div className={styles["info-container"]}>
          <button
            className={`g-button-image ${activeIndex == 0 ? "g-desativado" : ""}`}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <svg
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width={40}
              height={40}
            >
              <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
            </svg>
          </button>

          <div className={`${styles["info-box"]} shadow-2`}>
            <span
              className={`${styles["info-texto"]} ${expansor ? styles["info-texto-aberto"] : styles["info-texto-fechado"]}`}
            >
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                faucibus leo urna, non eleifend felis ullamcorper tincidunt.
                Vivamus dapibus gravida nunc.Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Sed faucibus leo urna, non eleifend
                felis ullamcorper tincidunt. Vivamus dapibus gravida nunc.Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus
                leo urna, non eleifend felis ullamcorper tincidunt. Vivamus
                dapibus gravida nunc.Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed faucibus leo urna, non eleifend felis
                ullamcorper tincidunt. Vivamus dapibus gravida nunc.
              </p>
            </span>
            <span
              className={styles["info-expansor"]}
              onClick={() => setExpansor(!expansor)}
            >
              {!expansor ? "Ler Mais..." : "Fechar"}
            </span>
            <div className={styles["info-details-div"]}>
              <p className={styles["info-details-tags"]}>
                #roguelike, #ação, #co-op, #fantasia, #roguelike, #ação, #co-op,
                #fantasia
              </p>
              <span className={styles["info-details-avaliacao"]}>
                <Image
                  src={"/ic/star.png"}
                  alt={"Imagem de avaliação"}
                  width={16}
                  height={16}
                />
                <p>10/10</p>
              </span>
              <button className={styles["info-details-preco"]}>R$ 9.99</button>
            </div>
          </div>

          <button
            className={`g-button-image ${activeIndex == slideMax - 1 ? "g-desativado" : ""}`}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <svg
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width={40}
              height={40}
            >
              <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
            </svg>
          </button>
        </div>
      </Swiper>
      <div className={styles["pagination-div"]}>
        <div ref={paginationRef} className={styles["pagination"]} />
      </div>
    </>
  ) : (
    <p>Carregando</p>
  );
}
