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
                    <div className="img one face"></div>
                </div>
                <div className="row typeTwo">
                    <div className="img two eyes"></div>
                    <div className="img two body"></div>
                </div>
                <div className="row typeTwo">
                    <div className="img two hair"></div>
                    <div className="img two sun"></div>
                </div>
            </div>
        </div>
    )
}

export default Categories;