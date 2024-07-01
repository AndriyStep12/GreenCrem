"use client";
import React from "react";
import Link from "next/link";
import './leftBar.scss'
import Linker from "./linker/linker";

const LeftBar = () => {
    return (
        <div className="leftBar">
            <h2 className="h2">Категорії</h2>
            <ul>
                <li><Linker name={`Догляд за обличчям`} path={'/products/face'} classN={'li'} /></li>
                <li><Linker name={`Для зони навколо очей`} path={'/products/eyes'} classN={'li'} /></li>
                <li><Linker name={`Догляд за тілом`} path={'/products/body'} classN={'li'} /></li>
                <li><Linker name={`Догляд за волоссям`} path={'/products/hair'} classN={'li'} /></li>
                <li><Linker name={`Сонцезахист`} path={'/products/sun'} classN={'li'} /></li>
                <li><Linker name={`Всі продукти`} path={'/products/'} classN={'li'} /></li>
            </ul>
            <Linker name={`Головна сторінка`} path={'/'} classN={'h2'} />
            <Linker name={`Контактна інформація`} path={'/'} classN={'h2'} />
            <Linker name={`Про нас`} path={'/'} classN={'h2'} />
        </div>
    )
}

export default LeftBar