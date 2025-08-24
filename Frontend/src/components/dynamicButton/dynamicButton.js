import React from "react";
import "./dynamicButton.css"; // External CSS file

const DynamicButton = ({ label, onClick, type = "button", styleClass }) => {
  return (
    <button
      className={`dynamic-button ${styleClass}`}
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default DynamicButton;
