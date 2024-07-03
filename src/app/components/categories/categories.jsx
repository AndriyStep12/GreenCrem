"use client";
import React from "react";
import Image from "next/image";
import './categories.scss'

const Categories = () => {
    return (
        <div className="categories">
            <h2>Категорії</h2>
            <div className="rows">
                <div className="row typeOne">
                    <Image 
                        className="img one face"
                        src="/face.png"
                        alt="Face"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="row typeTwo">
                    <Image 
                        className="img two eyes"
                        src="/eyes.png"
                        alt="Eyes"
                        layout="fill"
                        objectFit="cover"
                    />
                    <Image 
                        className="img two body"
                        src="/body.png"
                        alt="Body"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="row typeTwo">
                    <Image 
                        className="img two hair"
                        src="/hair.png"
                        alt="Hair"
                        layout="fill"
                        objectFit="cover"
                    />
                    <Image 
                        className="img two sun"
                        src="/katalog/sun.png"
                        alt="Sun"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>
        </div>
    )
}

export default Categories;
