"use client";
import React from "react";
import Image from "next/image";
import './categories.scss'
import Link from "next/link";

const Categories = () => {
    return(
        <div className="categories">
            <h2>Категорії</h2>
            <div className="rows">
                <div className="row typeOne">
                    {/* <Link href="/products/face"> */}
                        <div className="img one face"></div>
                    {/* </Link> */}
                </div>
                <div className="row typeTwo">
                    {/* <Link href="/products/eyes"> */}
                        <div className="img two eyes"></div>
                    {/* </Link> */}
                    {/* <Link href="/products/body"> */}
                        <div className="img two body"></div>
                    {/* </Link> */}
                </div>
                <div className="row typeTwo">
                    {/* <Link href="/products/hair"> */}
                        <div className="img two hair"></div>
                    {/* </Link> */}
                    {/* <Link href="/products/sun"> */}
                        <div className="img two sun"></div>
                    {/* </Link> */}
                </div>
            </div>
        </div>
    )
}

export default Categories;
