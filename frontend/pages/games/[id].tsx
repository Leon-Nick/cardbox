import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
// common
import { Game, gameStr } from "../../common/models/Game";
import { Event } from "../../common/events";

const Room: React.FC = () => {
  const router = useRouter();
  const roomID = router.query.id as string;
  console.log(`room ID: ${roomID}`);
  const socket = useMemo(() => io("http://localhost:8080"), []);

  const [gameState, setGameState] = useState<Game>();

  useEffect(() => {
    socket.on(Event.Connection, () => {
      console.log("socket connected");
      socket.emit(Event.JoinedRoom, roomID);
      console.log(`sent room ID ${roomID} to server`);
    });

    socket.on(Event.UpdatedGameState, (newGameState: Game) => {
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
              // const temp = gameState;
              // temp.meme = !temp.meme;
              // setGameState(temp);
              // if (socket) {
              //   socket.emit(Event.UpdatedGameState, gameState);
              //   console.log(`sent updated game state: `, gameState);
              // }
            }}
          >
            meme
          </button>
          <h1>Game State</h1>
          <code>{gameStr(gameState)}</code>
        </>
      )}
    </div>
  );
};

export default Room;
