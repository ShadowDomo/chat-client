import { useState } from "react";
import RoomInput from "./RoomInput";
import Room from "./Room";
import { DetailsContext } from "./DetailsContext";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const [username, setUsername] = useState<string>("");
  const [roomCode, setRoomCode] = useState<string>("");

  return (
    <div className="App container">
      <Router>
        <DetailsContext.Provider
          value={{
            usernames: [username, setUsername],
            room: [roomCode, setRoomCode],
          }}
        >
          <Switch>
            <Route path="/room">
              <Room />
            </Route>
            <Route path="/">
              <RoomInput />
            </Route>
          </Switch>
        </DetailsContext.Provider>
      </Router>
    </div>
  );
}

export default App;
