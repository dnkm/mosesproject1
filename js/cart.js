function Cart(cartTable) {
    var cart = this.loadCookie();
    var contentEnd = cartTable.querySelector("#cart_content_end");
    var cartItemTemplate = cartTable.querySelector("#cart_item_template");

    cart.forEach(function(cartItem) {
        var tr = this.createNewTr(cartItem, cartItemTemplate);
        contentEnd.parentNode.insertBefore(tr, contentEnd);
    }, this);

    
}
Cart.prototype.createNewTr = function(cartItem, cartItemTemplate) {
    var tr = cartItemTemplate.cloneNode(true);
    var thumb = (cartItem.type === "Sourdough Baguette") ? "images/common/thumbs_baguette_01.jpg" : "images/common/thumbs_boule_01.jpg";

    tr.querySelector(".thumbs img").setAttribute("src", thumb);
    tr.querySelector("button").innerText = cartItem.type;

    cartItem.flavors.forEach(function(flv) {
        var flvClass = flv.replace(" ","").toLowerCase();
        var btn = document.createElement("button");
        btn.className = "btn btn-sm btn-bg active";
        btn.classList.add("btn-"+flvClass);
        btn.innerText = flv;
        btn.style.marginRight = "3px";

        tr.querySelector("td").appendChild(btn);
    })


    tr.querySelector("td:nth-child(2)").innerText = this.calculateUnitPrice(cartItem).toFixed(2);
    tr.querySelector(".quantity-input").value = cartItem.num;
    tr.querySelector("td:nth-child(4) span").innerText = (this.calculateUnitPrice(cartItem) * cartItem.num).toFixed(2);
    
    return tr;
}
Cart.prototype.loadCookie = function() {
    var cartCookie = 
        document.cookie.split(";")
            .map(function(x) {
                return x.trimLeft()
            }).filter( function(x) {
                return x.startsWith("cart=")
            }).map( function(x) {
                return x.replace("cart=","");
            })[0] || "[]";

    cart = JSON.parse(cartCookie);
    cart = cart.map(function(el) {
        return JSON.parse(el);
    })
    return cart;
}
Cart.prototype.calculateUnitPrice = function(cartItem) {
    return 3.5 + cartItem.flavors.length * 0.5;
}


function CartItem(type, flavors, num) {
    this.type = type;
    this.flavors = flavors;
    this.num = num;

    this.getPrice = function() {
        return (3.5 + this.flavors.length * 0.5) * this.num;
    }
}

function OrderPage(orderPage, type) {
    this.type = type;
    this.orderPage = orderPage;
    this.flavorOptions = orderPage.querySelector(".flavor_options");
    this.quantityInput = orderPage.querySelector("#quantity");
    

    var that = this;
    orderPage.querySelectorAll("input, button").forEach(function(tag) {
        tag.addEventListener('click', function(ev) { 
            that.onInputClick(ev);
        });
    })

    this.activateThumbnails();
}
OrderPage.prototype.activateThumbnails = function() {
    var prevDiv = this.orderPage.querySelector(".goods-prview");
    var imgHolder = this.orderPage.querySelector("img");
    prevDiv.querySelectorAll("li img").forEach(function(img,i) {
        img.addEventListener('click', () => {
            imgHolder.setAttribute('src', img.dataset.img);
        })
    })
}
OrderPage.prototype.onInputClick = function(ev) {
    var tag = ev.target;

    switch(tag.id) {
        case "quantity_less":
            this.quantityInput.value = Math.max(parseInt(this.quantityInput.value) - 1, 0);
            break;
        case "quantity_more":
            this.quantityInput.value = parseInt(this.quantityInput.value) + 1;
            break;
        case "r-flavor":
            this.flavorOptions.classList.add("on");
            break;
        case "r-basic":
            this.flavorOptions.classList.remove("on");
            break;
        case "addToCart":
            return this.addToCart();
    }
    
    
    var numOptions = this.flavorOptions.querySelectorAll("input:checked").length;
    if (numOptions > 2) {
        ev.preventDefault();
        return false;
    }

    var quantity = parseInt(this.orderPage.querySelector("#quantity").value);

    var price = (3.5 + 0.5 * ((this.flavorOptions.classList.contains("on")) ? numOptions : 0)) * quantity;
    this.orderPage.querySelector("#final_price").innerText = "$" + price.toFixed(2);
}
OrderPage.prototype.addToCart = function() {
    var flavors = [];
    this.flavorOptions.querySelectorAll("input:checked").forEach(function(tag) {
        flavors.push(tag.value);
    })
    var num = parseInt(this.orderPage.querySelector("#quantity").value);

    var cartItem = new CartItem(this.type, flavors, num);

    // get a cookie
    var cartCookie = 
        document.cookie.split(";")
            .map(function(x) {
                return x.trimLeft()
            }).filter( function(x) {
                return x.startsWith("cart=")
            }).map( function(x) {
                return x.replace("cart=","");
            })[0] || "[]";

    cart = JSON.parse(cartCookie);
    cart.push(JSON.stringify(cartItem));
    document.cookie = "cart=" + JSON.stringify(cart);

    window.location.href= "mycart.html";
}



