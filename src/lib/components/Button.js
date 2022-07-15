import React from 'react';
import Modal from 'react-modal'

const Button = (props) => {
    return (
        <>
            <div className="p-4 bg-black mt-4">
                <button className="w-full bg-pink-500 text-white font-bold  py-2 px-12 rounded" >BUY</button>
            </div>
            {/* <button className={`btn btn--${props.kind} CTA`}
                data-id={props.id}
                type={props.type}
                name={props.name}
                value={props.value}
                disabled={props.disabled}
                onClick={props.handleClick}>
                <h4>{props.label}</h4>
            </button> */}
        </>
    )
}
export default Button;