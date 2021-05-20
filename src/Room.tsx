import io from "socket.io-client";
import { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { DetailsContext } from "./DetailsContext";
import Message from "./Message";
import "./CSS/room.css";

const SOCKET_SERVER: any = process.env.REACT_APP_SOCKET_SERVER;

export interface MessageObject {
  content?: string;
  username: string;
  time: string;
  status?: string;
}

const Room = () => {
  const [username, setUsername] = useContext(DetailsContext).usernames;
  const [roomCode, setRoomCode] = useContext(DetailsContext).room;
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const history = useHistory();
  const emptyDiv: any = useRef(null);

  /** Adds a message */
  function addMessage(message: MessageObject) {
    setMessages((currentMessages) => {
      const newMessages = [...currentMessages];
      // if (newMessages.length > 9) {
      //   newMessages.shift();
      // }

      newMessages.push(message);
      return newMessages;
    });
  }

  useEffect(() => {
    let mounted = true;
    const socket = io(SOCKET_SERVER);
    setSocket(socket);
    if (username === "" || roomCode === "") {
      history.push("/");
    }

    if (mounted) {
      socket.emit("joinRoom", { username: username, roomCode: roomCode });

      // whenever new user joins
      socket.on("joinedRoom", (val) => {
        // console.log(val);
        addMessage({ ...val, status: "has joined the room" });
      });

      socket.on("message", (message) => {
        // console.log(message);
        addMessage(message);
      });

      socket.on("disconnected", (message) => {
        // console.log(message);
        addMessage({ ...message, status: "has left the room" });
      });

      socket.on("typingEnded", (obj) => {
        // addMessage({ ...obj, status: "is typing..." });
        setTypingUsers((currentUsers) => {
          const newUsers = [...currentUsers];
          return newUsers.filter((user) => user !== obj.username);
        });
        // console.log("ended");
      });

      socket.on("typingStarted", (obj) => {
        // console.log(message);
        // console.log(obj);
        setTypingUsers((currentUsers: string[]) => {
          if (!currentUsers.includes(obj.username)) {
            return [...currentUsers, obj.username];
          }
          return currentUsers;
        });
      });
    }
    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, [username, roomCode]);

  useEffect(() => {
    emptyDiv.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setMessage("");
    socket.emit("message", {
      content: message,
      username: username,
    });
  }

  function typing() {
    // emptyDiv.current.scrollIntoView({ behavior: "smooth" });
    socket.emit("typing", { username: username });
  }

  function usersTyping() {
    if (typingUsers.length === 0) {
      return;
    }

    if (typingUsers.length === 1) {
      return <small className="">{typingUsers.toString()} is typing...</small>;
    }

    return (
      <small className="mb-2">{typingUsers.join(", ")} are typing...</small>
    );
  }

  return (
    <div className="d-flex flex-column container overflow-auto">
      <h1 className="row mt-5">Chat room - {roomCode}</h1>
      <div
        className="row overflow-auto"
        style={{
          maxHeight: "76vh",
          marginBottom: "120px",
        }}
      >
        <div className="col ">
          {messages.map((message, index) => (
            <Message
              key={index}
              prevMessage={index > 0 ? messages[index - 1] : null}
              message={message}
              userUsername={username}
            />
          ))}
        </div>
        <div ref={emptyDiv}></div>
      </div>
      <div className="fixed-bottom mb-5 container">
        <div className="text-center">{usersTyping()}</div>
        <form className="form-group d-flex mt-1">
          <input
            type="text"
            className="form-control"
            placeholder="Type something..."
            style={{ marginRight: "15px" }}
            value={message}
            onChange={(e) => {
              typing();
              setMessage(e.target.value);
            }}
          />
          <button
            className="btn btn-primary"
            type="submit"
            onClick={(e) => sendMessage(e)}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Room;
