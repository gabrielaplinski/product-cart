const cart = [];
const cartList = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const emptyCart = document.querySelector("#empty-cart");
const cartQuantity = document.querySelector("#cart-quantity")

document.querySelectorAll(".addTo").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const id = button.dataset.id;

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1});
        }

        updateCart();
    });
});

function updateCart() {
    cartList.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        const li = document.createElement("li");
        li.classList.add("cart-item");

        const name = document.createElement("p");
        name.classList.add("cart-name");
        name.textContent = item.name;

        const details = document.createElement("p");
        details.classList.add("cart-details");
        details.textContent = `${item.quantity}x @$${item.price.toFixed(2)}`;

        const itemTotal = document.createElement("p");
        itemTotal.classList.add("cart-total");
        itemTotal.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-btn");
        removeBtn.textContent = ""; 
        removeBtn.addEventListener("click", () => {
            removeItem(item.id);
        });
        
        li.appendChild(name);
        li.appendChild(details);
        li.appendChild(itemTotal);
        li.appendChild(removeBtn);

        cartList.appendChild(li);
    });
    
    cartTotal.textContent = `Order Total $${total.toFixed(2)}`;
    cartQuantity.textContent = totalItems;

    emptyCart.style.display = cart.length > 0 ? "none" : "block";
}

function removeItem(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
    }
}