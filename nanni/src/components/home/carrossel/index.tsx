"use client";

import { useEffect, useRef, useState } from "react";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import styles from "./carrossel.module.css";
import { BsStarFill } from "react-icons/bs";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { ImNewTab } from "react-icons/im";
import { fetchJogosCarrossel } from "@/lib/service/HomeService";
import { getAvaliacoes } from "@/lib/service/JogoService";

export type HomeCarrosselImagem = {
  id: string;
  url: string;
  alt: string;
  sobre: string;
  avaliacao: number;
  numViews: number;
  tags: string[];
};

export default function HomeCarrossel() {
  const [list, setList] = useState<HomeCarrosselImagem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef<SwiperClass>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function run() {
      const items = await fetchJogosCarrossel(10);

      if (items) {
        const filteredItems = items.filter(({ url }) => url?.length > 0);
        const itemsComAvaliacao = await Promise.all(
          filteredItems.map(async (item) => {
            const nota = await getAvaliacoes(item.id, item.numViews);

            return {
              ...item,
              avaliacao: nota !== undefined ? nota : "00",
            } as HomeCarrosselImagem;
          }),
        );

        setList(itemsComAvaliacao);
      }
    }

    run();
  }, []);

  return list && list.length > 0 ? (
    <>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        navigation={true}
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
        className={styles["navigation"]}
      >
        {list.map((item) => (
          <SwiperSlide
            key={item.id}
            className={styles["slide"]}
            style={{ height: "400px" }}
          >
            <div className={styles["slide-div"]} style={{ height: "400px" }}>
              <Image
                src={item.url}
                alt={list[activeIndex]?.alt ?? ""}
                quality={75}
                fill
                unoptimized={true}
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
        <div className={styles["info-container"]}>
          <TiChevronLeft
            size={40}
            className={`
              g-button-image 
              ${styles["nav-icon"]}
              ${activeIndex == 0 ? "g-desativado" : ""}
            `}
            onClick={() => swiperRef.current?.slidePrev()}
          />

          <div className={`${styles["info-box"]} shadow-2`}>
            <span className={styles["info-texto"]}>
              <p>{list[activeIndex].sobre ?? ""}</p>
            </span>
            <p className={styles["info-redirect"]}>
              Visitar Página
              <ImNewTab />
            </p>
            <div className={styles["info-details-div"]}>
              <p className={styles["info-details-tags"]}>
                {list[activeIndex]?.tags.map((item) => `#${item}`).join(", ") ??
                  ""}
              </p>
              <span className={styles["info-details-avaliacao"]}>
                <BsStarFill />
                <p>{list[activeIndex]?.avaliacao ?? "--"}/10</p>
              </span>
              <button className={styles["info-details-preco"]}>R$ 9.99</button>
            </div>
          </div>
          <TiChevronRight
            className={`
              g-button-image 
              ${styles["nav-icon"]}
              ${activeIndex == list.length - 1 ? "g-desativado" : ""}
            `}
            onClick={() => swiperRef.current?.slideNext()}
            size={40}
          />
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
