"use client";
import React, {useState, useEffect} from "react";
import LeftBar from "@/app/components/leftBar/leftBar";
import Loader from "@/app/components/loader/loader";
import fetchGoodsFromServer from "@/functions/array";
import Good from "@/app/components/good/good";
import Head from "next/head";
import './searcher.scss'

export default function Searching({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [goods, setGoods] = useState([]);
    const [filteredGoods, setFilteredGoods] = useState([]);

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const fetchedGoods = await fetchGoodsFromServer();
                setGoods(fetchedGoods);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching goods:', error);
                setLoading(false);
            }
        };

        fetchGoods();
    }, []);

    const decodeId = (encodedId) => {
        return encodedId.replace(/%20/g, ' ');
    };

    const decodedId = decodeId(id);

    useEffect(() => {
        if (goods.length > 0) {
            const searchResults = searchGoods(goods, decodedId);
            setFilteredGoods(searchResults);
        }
    }, [goods, decodedId]);

    const searchGoods = (goods, searchTerm) => {
        return goods.filter(good => 
            good.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            good.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <>
            <Head>
                <link rel="icon" href="/Logo.webp" />
                <title>Пошук {id}. Green Crem - магазин косметики в Україні</title>
            </Head>
            <div className="searcher">
                <LeftBar/>
                <div className="content">
                    <h2>Пошук {id}</h2>
                    {loading ? (
                        <Loader />
                    ) : (
                    
                        <div className="row">
                            {filteredGoods.length > 0 ? (
                                filteredGoods.map(item => <Good key={item} id={item.id} name={item.name} price={item.price} descrption={item.description} count={item.count} img={item.img} />)
                            ) : (
                                <p>Не знайдено "{decodedId}"</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
