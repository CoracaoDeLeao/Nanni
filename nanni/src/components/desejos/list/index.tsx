"use client";

import styles from "@/styles/desejos.module.css";
import { DesejosItem } from "../item";
import { ItemDesejo } from "@/types/ItemDesejo";
import { useEffect, useState } from "react";
import {
  deleteDesejo,
  fetchListaDesejo,
} from "@/lib/service/ListaDesejoService";
import { useAuth } from "@/context/AuthContextProvider";
import { fetchJogos, getAvaliacoes } from "@/lib/service/JogoService";

export function DesejosList() {
  const { user } = useAuth();
  const [loadingState, setLoadingState] = useState({
    loading: true,
    error: false,
  });

  const [listDesejos, setListDesejos] = useState<ItemDesejo[]>([]);
  const [filteredListDesejos, setFilteredListDesejos] = useState<ItemDesejo[]>(
    [],
  );
  const [query, setQuery] = useState<string>("");

  // FAZ O FETCH DOS DADOS DE LISTA DE DESEJOS DO USUÁRIO
  useEffect(() => {
    async function run() {
      if (user && user.id) {
        return;
      }

      const tmp_desejos: ItemDesejo[] | undefined = await fetchListaDesejo(
        user.id,
      );

      if (tmp_desejos && tmp_desejos[0]?.jogoRef) {
        const tmp_jogos = await fetchJogos(
          tmp_desejos.map((item) => item.jogoRef.id),
        );

        if (tmp_jogos) {
          const obj = await Promise.all(
            tmp_desejos.map(async (item) => {
              const jogo = tmp_jogos.find((j) => j.id === item.jogoRef.id);
              if (!jogo) return;

              const avaliacao = await getAvaliacoes(jogo.id, jogo.numViews);
              return {
                ...item,
                jogo: {
                  nome: jogo.nome,
                  banner: jogo.banner,
                  nota_avaliacao: avaliacao,
                  preco: Number(jogo.preco),
                },
              } as ItemDesejo;
            }),
          );

          setLoadingState((prev) => ({
            ...prev,
            loading: false,
          }));

          const filteredObj = obj.filter((item): item is ItemDesejo =>
            Boolean(item),
          );

          setListDesejos(filteredObj);
          setFilteredListDesejos(filteredObj);
        }
      } else {
        setLoadingState((prev) => ({
          ...prev,
          loading: false,
          erro: true,
        }));
      }
    }

    run();
  }, [user]);

  // FUNÇÃO DE QUERY
  useEffect(() => {
    if (listDesejos.length > 0) {
      const handler = setTimeout(() => {
        const q = query.toLowerCase().trim();

        if (q === "") {
          setFilteredListDesejos(listDesejos);
        } else {
          setFilteredListDesejos(
            listDesejos.filter((item) =>
              item.jogo.nome.toLowerCase().includes(q),
            ),
          );
        }
      }, 500);

      return () => clearTimeout(handler);
    }
  }, [query, listDesejos]);

  // > É redireciado para comprar item
  async function handleComprar(des_id: string) {
    alert("AINDA NÃO IMPLEMENTADO");
  }

  // > Deleta item
  async function handleDelete(des_id: string) {
    // if(user && user.id) {
    const r = await deleteDesejo("CJhHoFM6l3NhK3xfqL2U4yK9bXR2", des_id);

    if (r) {
      setListDesejos((prev) => prev.filter((item) => item.id !== des_id));
    }
    // }
  }

  if (!user) {
    return <p>Usuário não encontrado</p>;
  }

  return !loadingState.loading ? (
    <>
      <div className={styles["searchbar"]}>
        <input
          placeholder={"Buscar por nome"}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={styles["lista-desejos"]}>
        {filteredListDesejos.length > 0 ? (
          filteredListDesejos.map((item) => (
            <DesejosItem
              key={item.id}
              item={item}
              onComprar={() => handleComprar(item.id)}
              onDeletar={() => handleDelete(item.id)}
            />
          ))
        ) : (
          <p>Lista Vázia</p>
        )}
      </div>
    </>
  ) : (
    <p>Carregando...</p>
  );
}
