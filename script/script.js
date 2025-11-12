const cart = [];
const cartList = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const emptyCart = document.querySelector("#empty-cart");

document.querySelectorAll(".addTo").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1});
        }

        updateCart();
    });
});

function updateCart() {
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const li = document.createElement("li");
        li.textContent = `${item.name} ${item.quantity}x @$${item.price.toFixed(2)} $${(item.price * item.quantity).toFixed(2)}`;
        cartList.appendChild(li);
    });
    cartTotal.textContent = `Order Total $${total.toFixed(2)}`;

    if (cart.length > 0) {
        emptyCart.style.display = "none";
    } else {
        emptyCart.style.display = "block";
    }
}