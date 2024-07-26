"use client";
import { useState, useEffect } from "react";
import React from "react";
import findCategorie from "@/functions/categories";
import fetchGoodsFromServer from "@/functions/array";
import LeftBar from "@/app/components/leftBar/leftBar";
import Good from "@/app/components/good/good";
import Head from "next/head";
import Loader from "@/app/components/loader/loader";
import '../products.scss';

export default function Sun() {
    const [loading, setLoading] = useState(true);
    const [goods, setGoods] = useState([]);
    const [arr, setArr] = useState([]);

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const fetchedGoods = await fetchGoodsFromServer();
                setGoods(fetchedGoods);
                setArr(findCategorie('Сонцезахист', fetchedGoods));
            } catch (error) {
                console.error('Error setting goods:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoods();
    }, []);

    return (
        <>
            <div className="products">
                <LeftBar />
                {loading ? <Loader /> : (
                    <div className="content">
                        <h2>Сонцезахист</h2>
                        <div className="row">
                            {arr.map(item => (
                                <Good
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    price={item.price}
                                    description={item.description}
                                    count={item.count}
                                    img={item.img}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
