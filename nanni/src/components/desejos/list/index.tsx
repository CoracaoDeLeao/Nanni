"use client";

import styles from "@/styles/desejos.module.css";
import { DesejosItem } from "../item";
import { ItemDesejo } from "@/types/ItemDesejo";
import { useEffect, useMemo, useState } from "react";
import {
  deleteDesejo,
  fetchListaDesejo,
} from "@/lib/service/ListaDesejoService";
import { useAuth } from "@/context/AuthContextProvider";
import { fetchJogos, getAvaliacoes } from "@/lib/service/JogoService";
import { DesejosSearchBar } from "../searchbar";
import { DesejosDropdown, DesejosDropdownItemProps } from "../dropdown";
import { BsFillPersonXFill } from "react-icons/bs";

export function DesejosList() {
  const { user } = useAuth();
  const [loadingState, setLoadingState] = useState({
    loading: true,
    error: false,
  });

  const [listDesejos, setListDesejos] = useState<ItemDesejo[]>([]);
  const [query, setQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<DesejosDropdownItemProps>({
    selected: 0,
    items: [
      {
        id: 0,
        titulo: "A-Z",
      },
      {
        id: 1,
        titulo: "Z-A",
      },
    ],
  });

  // FAZ O FETCH DOS DADOS DE LISTA DE DESEJOS DO USUÁRIO
  useEffect(() => {
    async function run() {
      if (!(user && user.id)) {
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

          const filteredObj = obj.filter((item): item is ItemDesejo =>
            Boolean(item),
          );

          setListDesejos(filteredObj);

          setLoadingState((prev) => ({
            ...prev,
            loading: false,
          }));
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
  const filteredListDesejos = useMemo(() => {
    const q = query.toLowerCase().trim();

    let filtered =
      q === ""
        ? listDesejos
        : listDesejos.filter((item) =>
            item.jogo.nome.toLowerCase().includes(q),
          );

    filtered = [...filtered].sort((a, b) => {
      return a.jogo.nome.localeCompare(b);
    });

    return typeFilter.selected === 1 ? filtered.reverse() : filtered;
  }, [query, typeFilter.selected, listDesejos]);

  // > É redireciado para comprar item
  async function handleComprar(des_id: string) {
    alert("AINDA NÃO IMPLEMENTADO");
  }

  // > Deleta item
  async function handleDelete(des_id: string) {
    const r = await deleteDesejo(user.id, des_id);

    if (r) {
      setListDesejos((prev) => prev.filter((item) => item.id !== des_id));
    }
  }

  if (!user) {
    return (
      <span className={styles["offline"]}>
        <BsFillPersonXFill size={25} />
        <p>Usuário não encontrado.</p>
      </span>
    );
  }

  return !loadingState.loading ? (
    <>
      <div className={styles["filterbar"]}>
        <DesejosSearchBar setQuery={setQuery} />
        <DesejosDropdown listItems={typeFilter} setListItems={setTypeFilter} />
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
