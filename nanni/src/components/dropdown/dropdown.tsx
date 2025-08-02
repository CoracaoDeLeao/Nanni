import { useRef, useState } from "react";

type DropdownProps = {
  opcoes: string[];
  styles: { [key: string]: string };
  onChange: (opcaoSelecionada: string) => void;
  value: string;
};

export default function Dropdown({
  opcoes,
  styles,
  onChange,
  value,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleClick(opcao: string) {
    onChange(opcao);
    setIsOpen(false);
  }

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div
        className={`${styles.dropdownHeader} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <svg
          className={`${styles.dropdownIcon} ${isOpen ? styles.rotate : ""}`}
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.dropdownOptions}>
          {opcoes.map((opcao) => (
            <div
              key={opcao}
              className={`${styles.dropdownOption} ${
                value === opcao ? styles.selected : ""
              }`}
              onClick={() => handleClick(opcao)}
            >
              {opcao}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
