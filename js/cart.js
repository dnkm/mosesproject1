let option3;

window.addEventListener('load', () => {
    option3 = document.querySelector("#option3");

    activateThumbnails();

    document.querySelector("#r-basic").addEventListener('click', () => {
        option3.classList.remove("on");
        updateCart();
    });

    document.querySelector("#r-flavor").addEventListener('click', () => {
        option3.classList.add("on");
    });

    document.querySelectorAll("#option3 input").forEach(input => {
        input.addEventListener('click', updateCart);
    });
})

function activateThumbnails() {
    let prevDiv = document.querySelector(".goods-prview");
    let imgHolder = prevDiv.querySelector("img");
    prevDiv.querySelectorAll("li img").forEach((img,i) => {
        img.addEventListener('click', () => {
            imgHolder.setAttribute('src', img.dataset.img);
        })
    })
}

function resetOptions() {

}

function updateCart() {
    let numOptions = (option3.classList.contains("on")) ? document.querySelectorAll("#option3 input:checked").length : 0;

    let price = 3.5 + 0.5 * numOptions;

    document.querySelector("#final_price").innerText = "$" + price.toFixed(2);
}