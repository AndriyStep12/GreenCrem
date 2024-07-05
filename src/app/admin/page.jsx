"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import './admin.scss';

export default function AdminPanel() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [count, setCount] = useState(0);
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);

  const onInputChangeImage = (e) => {
    setImage(e.target.files[0]);
  };

  const onInputChangeName = (e) => {
    setName(e.target.value);
  };

  const onInputChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const onInputChangePrice = (e) => {
    setPrice(e.target.value);
  };

  const onInputChangeCount = (e) => {
    setCount(e.target.value);
  };

  const onInputChangeTag = (e) => {
    setTag(e.target.value);
  };

  const addTag = (e) => {
    e.preventDefault();
    if (tag) {
      setTags([...tags, tag]);
      setTag('');
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("count", count);
    tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    try {
      const result = await axios.post("https://greencrem.onrender.com/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(result.data);
    } catch (error) {
      console.error("There was an error uploading the data!", error);
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/Logo.webp" />
        <title>Admin Panel. Green Crem - магазин косметики в Україні</title>
      </Head>
      <div className="adminWrap">
        <h1>Admin Panel</h1>
        <form onSubmit={submit}>
          <input type="file" accept="image/*" onChange={onInputChangeImage} />
          <input type="text" placeholder="Назва" value={name} onChange={onInputChangeName} />
          <input type="text" placeholder="Опис" value={description} onChange={onInputChangeDescription} />
          <input type="number" placeholder="Ціна" value={price} onChange={onInputChangePrice} />
          <input type="number" placeholder="Кількість" value={count} onChange={onInputChangeCount} />
          <div className="tags">
            <input type="text" placeholder="Тег" value={tag} onChange={onInputChangeTag} />
            <button className="tagUploader" onClick={addTag}>Добавити тег</button>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
