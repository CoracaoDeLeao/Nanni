import { faixaEtaria, getFaixaEtaria } from "@/types/FaixaEtaria";
import Image from "next/image";
import styles from "./components.jogos.clsindicativa.module.css";

export function JogosClassificaoIndicativa({
    clsIndicativa
} : {
    clsIndicativa: string,
}) {
    const f: faixaEtaria = getFaixaEtaria({clsIndicativa});
    const iconSize = 65;

    if(f) {
        return (
            <span className={styles["faixa-div"]}>
                <Image
                    alt={clsIndicativa}
                    src={f.link_icone}
                    color={f.fill_color}
                    width={iconSize}
                    height={iconSize} />
                <p>{f.titulo}</p>
            </span>
        );
    }
}