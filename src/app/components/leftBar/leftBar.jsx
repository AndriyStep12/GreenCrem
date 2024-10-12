"use client";
import React, { useState } from "react";
import Link from "next/link";
import './leftBar.scss'
import Linker from "./linker/linker";

const LeftBar = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleLeftBar = () => {
        setIsVisible(!isVisible);
    };

    return (
        <>
            <div className="centerLeftBar">
                <button className="toggle-button" onClick={toggleLeftBar}>
                    ☰
                </button>
            </div>
            <div className={`leftBar ${isVisible ? 'visible' : 'hidden'}`}>
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
                <Linker name={`Телеграм бот`} path={'https://t.me/greencrem_bot'} classN={'h2'} />
                <Linker name={`Як користуватися ботом`} path={'/telegram-help'} classN={'h2'} />
            </div>
        </>
    );
};

export default LeftBar;
