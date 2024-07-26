"use client";
import React, {useState, useEffect} from "react";
import Action from "../action/action";
import Categories from "../categories/categories";
import Good from "../good/good";
import './popular.scss'
import fetchGoodsFromServer from "@/functions/array";
import Head from "next/head";

const MainPage = () => {

    const [goods, setGoods] = useState([]);

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const fetchedGoods = await fetchGoodsFromServer();
                setGoods(fetchedGoods);
            } catch (error) {
                console.error('Error setting goods:', error);
            }
        };

        fetchGoods();
    }, []);

    return (
        <>
            <Head>
                <link rel="icon" href="/Logo.webp" />
                <title>Green Crem - магазин косметики в Україні</title>
            </Head>
            <div className="mainPage">
                <Action />
                <Categories/>
            </div>
        </>
    )
}

export default MainPage;