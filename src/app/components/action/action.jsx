"use client";
import './action.scss'
import React from "react";
import Image from 'next/image';

const Action = () => {
    return(
        <div className="action">
            <span className='white_text'>При покупці на суму 3000 грн</span>
            <Image className="logo" src="/Logo.webp" alt="Logo" width={100} height={100}/>
            <span className='white_text'>Travel-версія сироватки у подарунок</span>
        </div>
    )
}

export default Action;