import React from "react";

function Button(props){
    return (<button value={props.buttonId} onClick={(event) => {props.handleClick && props.handleClick(event)}} className={`Button ${props.modifierClass}`} type={props.buttonType ? props.buttonType : "submit"}>{props.buttonText}</button>);
}

export default Button;