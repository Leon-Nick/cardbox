import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";
import { randomRoomID } from "../utils/random";

const Home: NextPage = () => {
  const router = useRouter();

  function newGame() {
    const roomID = randomRoomID();
    router.push(`/games/${roomID}`);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Cardenza</title>
        <meta name="description" content="Multiplayer card simulator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={newGame}>
        <h1>new game</h1>
      </button>
    </div>
  );
};

export default Home;
