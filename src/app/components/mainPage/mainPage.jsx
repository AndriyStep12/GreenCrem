"use client";
import React, {useState, useEffect} from "react";
import Action from "../action/action";
import Categories from "../categories/categories";
import Good from "../good/good";
import './popular.scss'
import fetchGoodsFromServer from "@/functions/array";


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
        <div className="mainPage">
            <Action />
            <Categories/>
            <div className="popularGoods">
                <h2>Популярні товари</h2>
                <div className="center">
                    <div className="row">
                        {goods.map(item => <Good key={item} id={item.id} name={item.name} price={item.price} descrption={item.description} count={item.count} img={item.img} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainPage;