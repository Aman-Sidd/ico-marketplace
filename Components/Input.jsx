import React from "react";

const Input = ({placeholder, handleChange}) => {
  return <div>
    <input
    type="text"
    placeholder={placeholder}
    onChange={handleChange}
    className={"input-style"}
    />
  </div>;
};

export default Input;
