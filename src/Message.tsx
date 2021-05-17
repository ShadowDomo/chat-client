import { MessageObject } from "./Room";

interface Props {
  message: MessageObject;
}
const Message = ({ message }: Props) => {
  function body() {
    if ("status" in message) {
      return (
        <div className="my-1 rounded py-1 px-2">
          <div className="d-flex justify-content-center">
            <small>
              {message.username} {message.status}
            </small>
          </div>
        </div>
      );
    }
    return (
      <div className="border border-secondary my-1 rounded py-1 px-2">
        <div className="d-flex justify-content-between">
          <small>{message.username}</small>
          <small>
            {new Date(parseInt(message.time))
              .toLocaleTimeString("en-AU")
              .toString()}
          </small>
        </div>
        <h6>{message.content}</h6>
      </div>
    );
  }
  return body();
};
export default Message;
