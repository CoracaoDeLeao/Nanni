import BuscarFilter from "@/components/buscar/filter";
import { BuscarItem } from "@/components/buscar/item";
import styles from "@/styles/buscar.module.css";


export default function BuscarJogoPage() {    
    return (
        <main className={"g-margin container shadow-1"}>
            <div className={`g-padding shadow-2 ${styles["header"]}`}>
                <span className={styles["resultado"]}>
                    <p>Resultado da Pesquisa:</p>
                    <p className={styles["resultado__query"]}>
                        {"Amorous"}
                    </p>
                </span>
                <BuscarFilter />
            </div>
            <div className={`g-padding ${styles["list"]}`}>
                <BuscarItem />
                <BuscarItem />
                <BuscarItem />
                <BuscarItem />
            </div>
        </main>
    );
}