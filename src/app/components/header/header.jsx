"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import './header.scss';
import useLikesStore from "@/functions/likes";
import useCartStore from "@/functions/cart";

const Header = () => {
    const [search, setSearch] = useState('');
    const { likes } = useLikesStore();
    const { carts } = useCartStore();

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchClick = () => {
        if (search.trim() === '') {
            alert("Будь ласка, введіть щось для пошуку");
            return;
        }
        window.location.href = `/products/search/${search}`;
    };

    return (
        <header className="header">
            <Link className="main" href={'/'}>
                <div style={{ cursor: 'pointer' }} className="logoDiv">
                    <Image className="logo" src="/Logo.webp" alt="Logo" width={100} height={100} />
                    <h1 className="logoText">Green Crem</h1>
                </div>
            </Link>
            <div className="search">
                <input value={search} onChange={handleSearchChange} type="text" placeholder="Пошук..." />
                <button className="iconBtn" id="searchBtn" onClick={handleSearchClick} alt="search">
                    <Image className="icon" src="/icons/search.png" alt="search" width={100} height={100} />
                </button>
            </div>
            <div className="btns">
                <Link href={'/cart'}>
                    <button className="iconBtn" alt="cart">
                        <Image className="icon" src="/icons/cart.png" alt="cart" width={100} height={100} />
                        {carts > 0 && <span className="badge">{carts}</span>}
                    </button>
                </Link>
                <Link href={'/wishlist'}>
                    <button className="iconBtn" alt="fav">
                        <Image className="icon" src="/icons/favourite.png" alt="favourite" width={100} height={100} />
                        {likes > 0 && <span className="badge">{likes}</span>}
                    </button>
                </Link>
            </div>
        </header>
    );
};

export default Header;
