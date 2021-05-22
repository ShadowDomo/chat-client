import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { DetailsContext } from "./DetailsContext";

const RoomInput = () => {
  const [localUsername, setLocalUsername] = useState<string>("");
  const [localRoomCode, setLocalRoomCode] = useState<string>("");

  const [username, setUsername] = useContext(DetailsContext).usernames;
  const [roomCode, setRoomCode] = useContext(DetailsContext).room;
  const history = useHistory();

  function joinRoom() {
    setUsername(localUsername);
    setRoomCode(localRoomCode);
    history.push("/room");
  }

  return (
    <form className="container mt-4">
      <h1>Chat room</h1>
      <div className="form-group">
        <label className="">Username</label>
        <input
          className="form-control"
          type="text"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
        />
      </div>
      <div className="form-group mt-2">
        <label className="">Room Code</label>
        <input
          className="form-control"
          type="text"
          value={localRoomCode}
          onChange={(e) => setLocalRoomCode(e.target.value)}
        />
      </div>
      <button onClick={joinRoom} className="btn btn-primary mt-2">
        Join room
      </button>
    </form>
  );
};

export default RoomInput;
