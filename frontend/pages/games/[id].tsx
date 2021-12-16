import { useEffect, useRef, useState } from "react";
import { Game } from "../../common/models/game";
import io from "socket.io-client";
import { useRouter } from "next/router";

const Room: React.FC = () => {
  const router = useRouter();
  const roomID = router.query.id as string;
  console.log(`room ID: ${roomID}`);

  const socketRef = useRef(io("http://localhost:8080"));
  const socket = socketRef.current;

  const [gameState, setGameState] = useState<Game>();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected");
      socket.emit("roomID", roomID);
      console.log(`sent room ID ${roomID} to server`);
    });

    socket.on("gameState", (newGameState: Game) => {
      setGameState(newGameState);
      console.log(`received game state update: ${newGameState}`);
    });

    return () => {
      socket.disconnect();
      console.log(`disconnected`);
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
              console.log(`sent updated game state: ${gameState}`);
            }}
          >
            meme
          </button>
          <h1>Game State</h1>
          <code>{gameState}</code>
        </>
      )}
    </div>
  );
};

export default Room;
