"use client";
import Link from "next/link";

function Linker({name, path, classN}){
    return(
        <a href={path} className={classN}>{name}</a>
    )
}

export default Linker