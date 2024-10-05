"use client";
import React, { useState, useEffect } from "react";
import LeftBar from "@/app/components/leftBar/leftBar";
import Loader from "@/app/components/loader/loader";
import fetchGoodsFromServer from "@/functions/array";
import Good from "@/app/components/good/good";
import './searcher.scss';

export default function Searching({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [goods, setGoods] = useState([]);
    const [filteredGoods, setFilteredGoods] = useState([]);

    const decodedId = decodeURIComponent(id);

    const searchGoods = (goods, searchTerm) => {
        return goods.filter(good => 
            good.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            good.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const fetchedGoods = await fetchGoodsFromServer();
                setGoods(fetchedGoods);
                const searchResults = searchGoods(fetchedGoods, decodedId);
                setFilteredGoods(searchResults);
            } catch (error) {
                console.error('Error fetching goods:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoods();
    }, [decodedId]);

    return (
        <div className="searcher">
            <LeftBar />
            <div className="content">
                <h2>Пошук {decodedId}</h2>
                {loading ? (
                    <Loader />
                ) : (
                    <div className="row">
                        {filteredGoods.length > 0 ? (
                            filteredGoods.map(item => (
                                <Good 
                                    key={item.id} 
                                    id={item.id} 
                                    name={item.name} 
                                    price={item.price} 
                                    description={item.description} 
                                    count={item.count} 
                                    img={item.img} 
                                />
                            ))
                        ) : (
                            <p>Не знайдено "{decodedId}"</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
