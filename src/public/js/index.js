const socket = io();

const ulList = document.getElementById('realTimeList')

const showList = (products) => {
    ulList.innerHTML = '';
    products.forEach(e => {
        createLi(e)
    });
}; 

const createLi = (product) => {
    const newLi = document.createElement('li');
    newLi.id = product.id;
    newLi.innerHTML = `<h4>${product.title}</h4>
                        <p>${product.description}</p>
                        <p>${product.price}</p>
                        <p>${product.code}</p>`;            
    ulList.appendChild(newLi)
};

const deleteLi = (pid) => {
    const liToDelete = document.getElementById(pid);
    ulList.removeChild(liToDelete)
};

socket.on('sendUsers', (products) => {
    showList(products);
});

socket.on('newProduct', (newProduct) => {
    createLi(newProduct);
});

socket.on('updateProduct', (product) => {
    createLi(product)
});

socket.on('deleteProduct', (pid) => {
    deleteLi(pid);
});