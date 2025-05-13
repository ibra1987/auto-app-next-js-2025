


interface ButtonProps {
    style:string,
    action:()=>void,
    text:string,
    attrs?:Record<string,boolean | string>
}
const Button = ({style,action,attrs,text}:ButtonProps) => {
  return (
    <button {...attrs} className={style} onClick={action}>

            {text}
    </button>
  )
}

export default Button
