"use client";

import styles from "./SliderTwoThumbs.module.css";
import React from "react";
import { getTrackBackground, Range } from "react-range";

type SliderTwoThumbsProps = {
  values: number[];
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
  STEP?: number;
  MIN?: number;
  MAX?: number;
};

export default function SliderTwoThumbs({
  values,
  setValues,
  STEP = 1,
  MIN = 0,
  MAX = 500,
}: SliderTwoThumbsProps) {
  return (
    <div className={styles["container"]}>
      <div className={styles["container-slider"]}>
        <p>0 R$</p>
        <div style={{ flex: 1 }}>
          <Range
            values={values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={(values) => setValues(values)}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{ ...props.style }}
                className={styles["slider-track"]}
              >
                <div
                  ref={props.ref}
                  style={{
                    background: getTrackBackground({
                      values,
                      colors: ["var(--p3)", "var(--p5)", "var(--p3)"],
                      min: MIN,
                      max: MAX,
                    }),
                  }}
                  className={styles["slider-track__children"]}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props, isDragged }) => (
              <div
                {...props}
                key={props.key}
                className={`${styles["slider-thumb"]} ${isDragged ? styles["slider-thumb--drag"] : ""}`}
              />
            )}
          />
        </div>
        <p>{MAX} R$</p>
      </div>
      <output className={styles["label"]}>
        <p>
          {values[0].toFixed(2)} - {values[1].toFixed(2)}
        </p>
      </output>
    </div>
  );
}
