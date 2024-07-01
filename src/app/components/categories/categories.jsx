"use client";
import React from "react";
import Image from "next/image";
import './categories.scss'

const Categories = () => {
    return(
        <div className="categories">
            <h2>Категорії</h2>
            <div className="rows">
                <div className="row typeOne">
                    <div className="img one face" style={{backgroundImage: `url(/katalog/face.png)`}}></div>
                </div>
                <div className="row typeTwo">
                    <div className="img two eyes" style={{backgroundImage:  `url(/katalog/eyes.png)`}}></div>
                    <div className="img two body" style={{backgroundImage:  `url(/katalog/body.png)`}}></div>
                </div>
                <div className="row typeTwo">
                    <div className="img two hair" style={{backgroundImage:  `url(/katalog/hair.png)`}}></div>
                    <div className="img two sun" style={{backgroundImage:  `url(/katalog/sun.png)`}}></div>
                </div>
            </div>
        </div>
    )
}

export default Categories;