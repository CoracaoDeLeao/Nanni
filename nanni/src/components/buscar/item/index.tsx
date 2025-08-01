import Image from "next/image";
import styles from "./BuscarItem.module.css";
import { BsStarFill } from "react-icons/bs";


export function BuscarItem() {
    return (
        <div className={styles["item"]}>
            <div className={styles["banner"]}>
                <Image
                    alt="TESTE"
                    src={"./file.svg"}
                    width={100}
                    height={60}
                    className={styles["banner__image"]} />
            </div>
            
            <div className={styles["body"]}>
                <p className={styles["body__desc"]}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi molestie neque cursus elit tincidunt, a tincidunt quam tempus. Praesent in tristique metus.
                </p>
                <div className={styles["body-line"]}>
                    <span className={styles["body-line__avaliacao"]}>
                        <BsStarFill size={12} />
                        <p>{"09"}/10</p>
                    </span>
                    <button 
                        className={`g-button-image ${styles["body-line__btn"]}`}>
                        R$ {"9.00"}
                    </button>
                </div>
                <p className={styles["body-tags"]}>
                    #roguelike, #ação, #co-op, #fantasia, #teste, #teste2, #teste, #teste2, #teste, #teste2, #teste, #teste2
                </p>
            </div>
        </div>
    );
}