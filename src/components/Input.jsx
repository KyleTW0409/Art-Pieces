import React from "react";

function Input(props) {
  return (
    <div
      className={`InputBox u-margin-top-lg ${props.modifierClasses} ${
        props.invert && "InputBox--inverted"
      }`}
    >
      <input
        onInput={(event) => props.handleChange(event)}
        className="InputBox__input"
        type={props.inputType}
        value={props.inputValue}
        name={props.inputName}
        required
        min={props.min}
      />
      <label
        className={`InputBox__label ${
          props.inputValue !== "" && "InputBox__label--shifted"
        }`}
      >
        {props.labelText}
      </label>
    </div>
  );
}

export default Input;
