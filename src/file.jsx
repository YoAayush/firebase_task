import React from "react";
import App from './App.jsx'

let show = '';
const getAuth = () => {
    let password = prompt("Enter Password : ");
    if (password === import.meta.env.VITE_masterKey) {
        show = <App />
    } else {
        alert("You can't access to this site without Password!!")
        getAuth();
    }
}

getAuth();

export default function File() {
    return (
        <>
            {show}
        </>
    )
}