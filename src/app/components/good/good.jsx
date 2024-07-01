"use client";
import React from "react";
import Image from "next/image";
import './good.scss'
import Link from "next/link";
import LoveBtn from "../loveBtn/loveBtn";

const Good = ({name, img, id, description, count, price}) => {
    return(
        <div className="good">
            <div className="start"> 
                <Image src={`/uploads/${img}`} width={10000} height={10000} alt={name} className="image" />
            </div>
            <div className="center">
                {name}
                <div className="price">{price}$</div>
                <span className={count > 0 ? 'is': 'is_not'}>
                    {count > 0 ? 'Є в наявності': 'Нема в наявності'}
                </span>
            </div>
            <div className="end">
                <Link className="link" href={`/products/${id}`}><button className="buy">Сторінка продукту</button></Link>
                <LoveBtn idGood={id}/>
            </div>
        </div>
    )
}

export default Good;