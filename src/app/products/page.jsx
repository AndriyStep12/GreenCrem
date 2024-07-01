"use client";
import React, {useState, useEffect} from 'react';
import './products.scss'
import LeftBar from '../components/leftBar/leftBar';
import Good from '../components/good/good';
import fetchGoodsFromServer from '@/functions/array';

export default function Products() {

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
        <div className="products">
            <LeftBar />
            <div className="content">
                <h2>Всі товари</h2>
                <div className="row">
                    {goods.map(item => <Good key={item} id={item.id} name={item.name} price={item.price} descrption={item.description} count={item.count} img={item.img} />)}
                </div>
            </div>
        </div>
    );
}