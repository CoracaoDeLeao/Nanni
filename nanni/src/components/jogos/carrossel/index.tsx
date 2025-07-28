"use client";

import { Mousewheel, Navigation, Scrollbar, Thumbs } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./components.jogos.carrossel.module.css";

export default function JogosGaleria(
    galeria: string[],
    dimW: number = 700,
    dimH: number = 400,
) {
    const swiperRef = useRef<SwiperClass>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const [imgs, setImgs] = useState<string[] | null>(null);

    useEffect(() => {
        const tmp: string[] = [];

        if(galeria && galeria.length > 0) {
            galeria.forEach(item => {
                tmp.push(
                    item,
                );
            });

            setImgs(tmp);
        }
    }, [galeria]);


    return imgs && (
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
                className={styles["swiper"]}>
                {imgs.map((item, index) => (
                    <SwiperSlide key={index} style={{ 
                        position: "relative", 
                        display: "flex", 
                        justifyContent: "center",  
                        width: "100%",
                        maxHeight: dimH, 
                        aspectRatio: `${dimW} / ${dimH}`
                        }}>
                        <Image
                            src={item}
                            alt={`Galeria imagem : ${index+1}`}
                            fill
                            style={{
                                objectFit: "contain",
                            }}
                        />
                    </SwiperSlide>
                ))}
                <div className={styles["control-div"]}>
                    <button
                        className={`g-button-image ${styles["control-prev"]} ${activeIndex == 0 ? "g-desativado" : ""}`}
                        onClick={() => swiperRef.current?.slidePrev()}>
                            <svg
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                width={20}
                                height={20}>
                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                            </svg>
                    </button>
                    <button 
                        className={`g-button-image ${styles["control-next"]} ${activeIndex == slideMax - 1 ? "g-desativado" : ""}`}
                        onClick={() => swiperRef.current?.slideNext()}>
                            <svg
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                width={20}
                                height={20}>
                                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                            </svg>
                    </button>
                </div>
            </Swiper>

            {/* Thumbs */}
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
                className={styles["paginator"]}>
                    {imgs.map(({ id, img }) => (
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
        </div>
    );
}