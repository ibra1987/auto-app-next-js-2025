import React, { JSX } from "react"



interface ButtonProps {
    style:string,
    action?:(e:React.MouseEvent<HTMLButtonElement> | null)=>Promise<void> | void,
    text:string | JSX.Element,
    attrs?:Record<string ,any>
}
const Button = ({style,action,attrs,text}:ButtonProps) => {
  return (
    <button {...attrs} className={style} onClick={action}>

            {text}
    </button>
  )
}

export default Button
