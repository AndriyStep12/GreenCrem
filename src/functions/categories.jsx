const findCategorie = (categorie, array) => {
    return array.filter(item => item.tags.includes(categorie));
};

export default findCategorie;