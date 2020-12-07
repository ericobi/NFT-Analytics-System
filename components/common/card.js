import React from "react";
import cn from "classnames";

const Card = ({ image, name, isSelect = false, onClick }) => (
  <div
    className={cn(
      "p-4 cursor-pointer hover:bg-gray-500 flex flex-row items-center border-t border-gray-100",
      isSelect ? "bg-indigo-300" : "bg-white"
    )}
    onClick={onClick}
  >
    <div
      className="w-12 h-12 mr-4"
      style={{
        minWidth: "3rem",
        maxWidth: "3rem",
        minHeight: "3rem",
        maxHeight: "3rem",
      }}
    >
      <img
        alt=""
        src={image}
        className="w-full h-full object-contain mx-auto"
      />
    </div>
    <div className="w-36 text-md overflow-ellipsis overflow-hidden">{name}</div>
  </div>
);
export default Card;
