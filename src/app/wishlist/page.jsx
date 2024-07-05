"use client";
import React, {useState, useEffect} from "react";
import LeftBar from "../components/leftBar/leftBar";
import Wish from "./wishBlock/wish";
import Loader from "../components/loader/loader";
import Head from "next/head";
import './wishlist.scss'

export default function Wishlist () {

    const [loading, setLoading] = useState(true)

    const [loved, setLoved] = useState([]);

    useEffect(() => {
        const savedLoved = JSON.parse(localStorage.getItem('loved')) || [];
        setLoved(savedLoved);
        setLoading(false)
    }, []);

    return(
        <>
            <Head>
                <link rel="icon" href="/Logo.webp" />
                <title>Green Crem. Список бажаного</title>
            </Head>
            <div className="wishlist">
                <LeftBar/>
                {loading ? <Loader/>: 
                    <div className="content">
                        <h2>Список бажаного</h2>
                        <div className="row">
                            {loved.length > 0 ? loved.map(item => <Wish key={item} idGood={item} />): <h3 className="pusto" style={{textAlign: "center"}}>Ваш список бажаного пустий</h3>}
                        </div>
                    </div>
                }
            </div>
        </>
    )
}