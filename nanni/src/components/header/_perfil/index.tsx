"use client";

import { useEffect, useState } from "react";
import styles from "../components.header.carrossel.module.css";

import Image from "next/image";
import { useAuth } from "@/context/AuthContextProvider";
import { fetchUserAdditionalData } from "@/lib/service/UserService";
import { FaShoppingCart } from "react-icons/fa";

export function HeaderPerfil() {
    const [carrinho, setCarrinho] = useState(0);
    const [perfil, setPerfil]= useState<{ nome: string, src_avatar: string | undefined, loaded: boolean}> ({
        nome: "",
        src_avatar: undefined,
        loaded: false,
    });
    const { user } = useAuth();

    useEffect(() => {
        async function run() {
            try {
                const tmp_user = await fetchUserAdditionalData("CJhHoFM6l3NhK3xfqL2U4yK9bXR2");

                if(tmp_user?.nome) {
                    setPerfil({
                        nome: tmp_user.nome,
                        src_avatar: tmp_user?.avatar,
                        loaded: true,
                    });
                } 
            } catch(err) {
                console.error("Erro ao buscar dados de perfil em Header", err);
            }
        }

        if(user?.id) {
            run();
        }

        run();
    }, [user]);

    return perfil.loaded && (
        <div className={styles["header-perfil"]}>
            <p className={styles["header-perfil__nome"]}>
                {perfil.nome}
            </p>
            <div className={styles["header-perfil__imagem"]}>
                <Image
                    src={perfil.src_avatar ?? "/file.svg"}
                    alt={"Foto de Perfil"}
                    width={70}
                    height={70}
                    style={{ height: "auto" }}
                />
                {carrinho > 0 && (
                    <button 
                        className={styles["header-perfil__cart"]}>
                        <p>{carrinho}</p>
                        <FaShoppingCart />
                    </button>
                )}
            </div>
        </div>
    );
}