let cart = [];

let Tzap = [];

let modalQt = 1;
let modalKey = 0;
let inicioZap = "https://wa.me/5514998557869/?text=Seu%20Pedido:%20";

// Novo padrão document.querySelector
const docq = (el)=>document.querySelector(el);
const docqs = (el)=>document.querySelectorAll(el);

//Pega os itens do json pizzas.js
pizzaJson.map((item, index)=>{
    //clona o modelo pizza.item
    let pizzaItem = docq('.models .pizza-item').cloneNode(true);

    //  ###### Configurando Items ######
    
    //Aplica as informações do json nos campos
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //  ###### Configurando Modal ######

    //Função que faz abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        //Infos do modal
        docq('.pizzaBig img').src = pizzaJson[key].img;
        docq('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        docq('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        docq('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        //Trabalhando com os tamanhos - Padronizando o tam grande e colocando as infos
        docq('.pizzaInfo--size.selected').classList.remove('selected');
        docqs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        //Trabalhando com a quantidade
        docq('.pizzaInfo--qt').innerHTML = modalQt;
        
        //Personalizando a abertura do modal
        docq('.pizzaWindowArea').style.opacity = 0;
        docq('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            docq('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    //Aplica o modelo dentro de pizza-area
    docq('.pizza-area').append(pizzaItem);
})

//  ###### Eventos Modal ######
function closeModal() {
    docq('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        docq('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

docqs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

docq('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt <= 1){
    } else {
    modalQt--;
    docq('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

docq('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    docq('.pizzaInfo--qt').innerHTML = modalQt;
});

docqs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        docq('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

docq('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(docq('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

docq('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        docq('aside').style.left = '0';
    }
});

docq('.menu-closer').addEventListener('click', ()=>{
    docq('aside').style.left = '100vw';
});

function updateCart() {
    docq('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        docq('aside').classList.add('show');
        docq('.cart').innerHTML = '';
        
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        let pedidoZap = "";
        
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = docq('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = "P";
                    break;
                case 1:
                    pizzaSizeName = "M";
                    break;
                case 2:
                    pizzaSizeName = "G";
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1)
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            
            pedidoZap += `%0A${cart[i].qt}%20${pizzaItem.name}%20tam:%20${pizzaSizeName}%20=%20${pizzaItem.price}`;


            docq('.cart').append(cartItem);

        };
        
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        docq('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        docq('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        docq('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

        const criarLink = `${inicioZap}${pedidoZap.replace(/ /g, '%20')}%0ATotal:%20${total.toFixed(2)}`    
        console.log(criarLink);
        docq('.cart--finalizar').addEventListener('click', ()=>{
            window.location.href = criarLink;
        });

    } else {
        docq('aside').classList.remove('show');
        docq('aside').style.left = '100vw';
    }
}



/*
- Gerar o link do whatsapp dividido em 3 ok
    - inicio padrão ok
    - adicionar texto padrão ok
    - itens do pedido com % para espação ou quebra de linha ok

- anexar link ao finalizar o pedido

- fazer dentro do updateCart ok

*/