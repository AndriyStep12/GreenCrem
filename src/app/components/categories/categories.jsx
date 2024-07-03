"use client";
import React from "react";
import './categories.scss';
import Link from "next/link";

const Categories = () => {
    return(
        <div className="categories">
            <h2>Категорії</h2>
            <div className="rows">
                <div className="row typeOne">
                    <Link href="/products/face" passHref>
                        <a>
                            <div className="img one face"></div>
                        </a>
                    </Link>
                </div>
                <div className="row typeTwo">
                    <Link href="/products/eyes" passHref>
                        <a>
                            <div className="img two eyes"></div>
                        </a>
                    </Link>
                    <Link href="/products/body" passHref>
                        <a>
                            <div className="img two body"></div>
                        </a>
                    </Link>
                </div>
                <div className="row typeTwo">
                    <Link href="/products/hair" passHref>
                        <a>
                            <div className="img two hair"></div>
                        </a>
                    </Link>
                    <Link href="/products/sun" passHref>
                        <a>
                            <div className="img two sun"></div>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Categories;
