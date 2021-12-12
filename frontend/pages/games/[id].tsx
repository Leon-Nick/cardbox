import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Game } from "../../models/game";

type Update = {
  meme: boolean;
};

async function fetchGameState(id: string): Promise<Game> {
  const res = await fetch(`http://localhost:5000/session?id=${id}`);
  const data: Game = await res.json();
  return data;
}

async function updateGameState(id: string, update: Update): Promise<boolean> {
  const res = await fetch(`http://localhost:5000/session?id=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(update),
  });

  const success: boolean = await res.json();
  return success;
}

const GamePage: React.FC = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [gameState, setGameState] = useState<Game>();

  useEffect(() => {
    fetchGameState(id).then(setGameState);
  }, [id]);

  console.log(gameState);
  return (
    <div>
      {gameState && (
        <button
          onClick={() =>
            console.log(
              updateGameState(id, {
                meme: !gameState.meme,
              })
            )
          }
        >
          <h1>{gameState.meme ? "a" : "b"}</h1>
        </button>
      )}
    </div>
  );
};

export default GamePage;
