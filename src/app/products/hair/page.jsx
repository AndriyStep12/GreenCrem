"use client";
import { useState, useEffect } from "react";
import React from "react";
import findCategorie from "@/functions/categories";
import fetchGoodsFromServer from "@/functions/array";
import LeftBar from "@/app/components/leftBar/leftBar";
import Good from "@/app/components/good/good";
import Loader from "@/app/components/loader/loader";
import '../products.scss'

export default function Face(){

    const [loading, setLoading] = useState(true)

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

    const [arr, setArr] = useState([])

    useEffect(()=>{
        setArr(findCategorie('Догляд за волоссям', goods))
        setLoading(false)
    }, [])

    return(
        <div className="products">
            <LeftBar />
            {loading ? <Loader/>:
                <div className="content">
                    <h2>Догляд за волоссям</h2>
                    <div className="row">
                        {arr.map(item => <Good key={item} id={item.id} name={item.name} price={item.price} descrption={item.description} count={item.count} img={item.img} />)}
                    </div>
                </div>
            }
        </div>
    )
}