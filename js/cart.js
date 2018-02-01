function CartItem(type, flavors, num) {
    this.type = type;
    this.flavors = flavors;
    this.num = num;

    this.getPrice = function() {
        return 3.5 + this.flavors.length * 0.5;
    }
}

function OrderPage(orderPage) {
    this.orderPage = orderPage;
    this.flavorOptions = orderPage.querySelector(".dkcart_flavor_options");
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
            console.log(this.quantityInput.value)
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


window.addEventListener('load', () => {
    var cart = [];

    var orderPage = document.querySelector(".dkcart_order")
    if (orderPage) {
        new OrderPage(orderPage);
    }

})

