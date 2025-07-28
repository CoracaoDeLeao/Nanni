export type faixaEtaria = {
  titulo: string,
  link_icone: string,
  fill_color: string,
}

const _faixasTitulos: Record<string, string> = {
  "L": "Livre para todos os públicos",
  "10": "Não recomendado para menores de 10 anos",
  "12": "Não recomendado para menores de 12 anos",
  "14": "Não recomendado para menores de 14 anos",
  "16": "Não recomendado para menores de 16 anos",
  "18": "Não recomendado para menores de 18 anos",
};

const _faixasCores: Record<string, string> = {
  "L": "#00a550",
  "10": "#0096d9",
  "12": "#ffcc03",
  "14": "#f5821f",
  "16": "#eb1b24",
  "18": "#000000",
};


export function getFaixaEtaria({
  clsIndicativa,
} : {
  clsIndicativa: string,
}): faixaEtaria {
  return {
    titulo: _faixasTitulos[clsIndicativa],
    link_icone: `/faixa/${clsIndicativa}.svg`,
    fill_color: _faixasCores[clsIndicativa],
  };
} 