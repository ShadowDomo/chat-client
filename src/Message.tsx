import { MessageObject } from "./Room";
import ReactToolTip from "react-tooltip";
import React from "react";
import ReactDOM from "react-dom";

interface Props {
  message: MessageObject;
  userUsername: string;
  prevMessage: MessageObject | null;
}
const Message = ({ message, userUsername, prevMessage }: Props) => {
  function statusMessage() {
    return (
      <div className="rounded py-1 px-2 mb-1">
        <div className="d-flex justify-content-center">
          <small className="">
            {message.username} {message.status}
          </small>
        </div>
      </div>
    );
  }

  function normalMessage() {
    // float to right if you are message writer
    let justifyValue = "justify-content-";
    let alignItemsvalue = "align-items-";
    let color;
    let textColor;
    let borderRadius;

    if (message.username === userUsername) {
      justifyValue += "end";
      alignItemsvalue += "end";
      color = "bg-primary";
      textColor = "text-white";
      borderRadius = "18px 4px 4px 18px";
    } else {
      justifyValue += "start";
      alignItemsvalue += "start";
      color = "bg-white";
      textColor = "text-black";
      borderRadius = "4px 18px 18px 4px";
    }

    function renderUsername() {
      if (prevMessage === null) {
        return <small className="text-secondary">{message.username}</small>;
      }
      if ("status" in prevMessage) {
        return <small className="text-secondary">{message.username}</small>;
      }
      if (prevMessage.username !== message.username) {
        return <small className="text-secondary">{message.username}</small>;
      }

      return;
    }

    return (
      <div className={`d-flex ${justifyValue}`}>
        <div
          className={`d-flex flex-column ${alignItemsvalue}`}
          style={{ maxWidth: "70%" }}
          data-tip={new Date(parseInt(message.time))
            .toLocaleTimeString("en-AU")
            .toString()}
        >
          <ReactToolTip />
          {renderUsername()}
          <div
            className={`border border-secondary mt-1 p-2 ${color}`}
            style={{
              borderRadius: borderRadius,
            }}
          >
            <p className={`${textColor} mb-0 text-break`}>{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  function body() {
    if ("status" in message) {
      return statusMessage();
    }

    return normalMessage();
  }

  return body();
};
export default Message;
