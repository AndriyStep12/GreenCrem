"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from 'js-cookie';
import likes from "@/functions/likes";
import { updateCart, updateWishlist } from '@/functions/cartUtils';
import './header.scss';

const Header = () => {
    const { likes, likesIncrement, likesDecrement } = likes();
    const [search, setSearch] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        const cartItems = JSON.parse(Cookies.get('cart') || '[]');
        const wishlistItems = JSON.parse(localStorage.getItem('loved') || '[]');

        setCartCount(cartItems.length);
        setWishlistCount(wishlistItems.length);

        const handleCartChange = () => {
            const updatedCartItems = JSON.parse(Cookies.get('cart') || '[]');
            setCartCount(updatedCartItems.length);
        };

        const handleWishlistChange = () => {
            const updatedWishlistItems = JSON.parse(localStorage.getItem('loved') || '[]');
            setWishlistCount(updatedWishlistItems.length);
        };

        window.addEventListener('cartChanged', handleCartChange);
        window.addEventListener('wishlistChanged', handleWishlistChange);

        return () => {
            window.removeEventListener('cartChanged', handleCartChange);
            window.removeEventListener('wishlistChanged', handleWishlistChange);
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
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
                <Link href={`/products/search/${search}`}>
                    <button className="iconBtn" alt="search">
                        <Image className="icon" src="/icons/search.png" alt="search" width={100} height={100} />
                    </button>
                </Link>
            </div>
            <div className="btns">
                <Link href={'/cart'}>
                    <button className="iconBtn" alt="cart">
                        <Image className="icon" src="/icons/cart.png" alt="cart" width={100} height={100} />
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
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
