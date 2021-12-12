import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Game } from "../../models/game";

async function fetchGameState(id: string): Promise<Game> {
  const res = await fetch(`http://localhost:5000/session?id=${id}`);
  const data: Game = await res.json();
  return data;
}

const GamePage: React.FC = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState<Game>();

  useEffect(() => {
    const id = router.query.id as string;
    fetchGameState(id).then(setGameState);
  }, [router.query]);

  console.log(gameState);
  return (
    <div>
      <button onClick={() => null}>
        {gameState && <h1>{gameState.meme ? "a" : "b"}</h1>}
      </button>
    </div>
  );
};

export default GamePage;
