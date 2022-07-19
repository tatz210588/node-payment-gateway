import React from 'react';
import Modal from 'react-modal'

const styles = { color: "#0d56d4" }
const Button = (props) => {
    return (
        <>

            <button style={styles} >BUY</button>

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