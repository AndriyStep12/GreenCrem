"use client";
import React from "react";
import Image from "next/image";
import './categories.scss'

import Face from './katalog/face.png'
import Eyes from './katalog/eyes.png'
import Body from './katalog/body.png'
import Hair from './katalog/hair.png'
import Sun from './katalog/sun.png'

const Categories = () => {
    return(
        <div className="categories">
            <h2>Категорії</h2>
            <div className="rows">
                <div className="row typeOne">
                    <div className="img one face" style={{backgroundImage: `url(${Face})`}}></div>
                </div>
                <div className="row typeTwo">
                    <div className="img two eyes" style={{backgroundImage:  `url(${Eyes})`}}></div>
                    <div className="img two body" style={{backgroundImage:  `url(${Body})`}}></div>
                </div>
                <div className="row typeTwo">
                    <div className="img two hair" style={{backgroundImage:  `url(${Hair})`}}></div>
                    <div className="img two sun" style={{backgroundImage:  `url(${Sun})`}}></div>
                </div>
            </div>
        </div>
    )
}

export default Categories;