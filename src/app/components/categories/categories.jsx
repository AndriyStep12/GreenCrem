"use client";
import React from "react";
import './categories.scss';

const Categories = () => {
    const handleImgClick = (path) => {
        window.location.href = path;
    };

    return (
        <div className="categories">
            <h2>Категорії</h2>
            <div className="rows">
                <div className="row typeOne">
                    <div className="img one face" onClick={() => handleImgClick('/products/face')}></div>
                </div>
                <div className="row typeTwo">
                    <div className="img two eyes" onClick={() => handleImgClick('/products/eyes')}></div>
                    <div className="img two body" onClick={() => handleImgClick('/products/body')}></div>
                </div>
                <div className="row typeTwo">
                    <div className="img two hair" onClick={() => handleImgClick('/products/hair')}></div>
                    <div className="img two sun" onClick={() => handleImgClick('/products/sun')}></div>
                </div>
            </div>
        </div>
    );
}

export default Categories;
