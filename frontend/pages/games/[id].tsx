import { useEffect, useRef, useState } from "react";
import { Game } from "../../common/models/game";
import io from "socket.io-client";
import { useRouter } from "next/router";

const Room: React.FC = () => {
  const router = useRouter();
  const roomID = router.query.id as string;

  const socketRef = useRef(io("http://localhost:8080"));
  const socket = socketRef.current;

  const [gameState, setGameState] = useState<Game>();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("roomID", roomID);
    });

    socket.on("gameState", (newGameState: Game) => {
      setGameState(newGameState);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomID, socket]);

  return (
    <div>
      {gameState && (
        <>
          <button
            onClick={() => {
              const temp = gameState;
              temp.meme = !temp.meme;
              setGameState(temp);

              socket.emit("gameState", gameState);
            }}
          >
            meme
          </button>
          <h1>Game State</h1>
          <ul>
            {Object.entries(gameState).map(([key, val]) => (
              <li key={key}>
                {key}: {JSON.stringify(val)}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Room;
