import type { ReactElement } from "react";

export interface buttonProps{
    text : string;
    variant : "primary" | "secondary";
    onClick : ()=>void;
    startIcon? : ReactElement;
    endIcon? : ReactElement;
    size : "sm" |"md"|"lg"

}
export const ButtonComponent  = (props : buttonProps)=>{
    return <button onClick={props.onClick} style={props.size = "sm"}>{props.text}</button>
}
<ButtonComponent text="ansh" variant="primary" size="md" onClick={()=>{}}/>
