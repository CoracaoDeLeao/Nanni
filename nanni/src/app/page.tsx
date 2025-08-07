import styles from "@/styles/page.module.css";
import HomeContent from "@/components/home/content";
import HomeCarrossel from "@/components/home/carrossel";

export default function Home() {
  return (
    <main className={`g-margin ${styles["main"]} g-header-distance`}>
      <div style={{ position: "relative" }}>
        <HomeCarrossel />
        <span className={`${styles["main__carrosselBack"]} shadow-3`} />
      </div>

      <div className={"shadow-1 container g-padding"}>
        <HomeContent />
      </div>
    </main>
  );
}
