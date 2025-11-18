const cart = [];
const cartList = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const emptyCart = document.querySelector("#empty-cart");
const cartQuantity = document.querySelector("#cart-quantity");
const modalOverlay = document.querySelector("#overlay");
const modalCartList = document.querySelector("#modal-cart-list")

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

        updateButtonState(button, id);

        updateCart();
        saveCart();
    });
});

function updateButtonState(button, id) {
    const item = cart.find(i => i.id === id);

    const productImage = document.querySelector(`img[data-id="${id}"]`);

    if(!item) {
        button.innerHTML = `<span class="icon-add"></span> Add to Cart`;
        button.classList.remove("added");
        

        if (productImage) productImage.classList.remove("in-cart");

        return
    }

    button.classList.add("added");

    if (productImage) {
        productImage.classList.add("in-cart");
    }

    button.textContent = "";
    button.innerHTML = `<div class="qty-controls">
                        <span class="minus" role="button" tabindex="0"><img src="../assets/images/icon-decrement-quantity.svg" alt=""></span>
                        <span class="qty">${item.quantity}</span>
                        <span class="plus" role="button" tabindex="0"><img src="../assets/images/icon-increment-quantity.svg" alt=""></span>
                        </div>`;
    const minusButton = button.querySelector(".minus");
    const plusButton = button.querySelector(".plus");

    minusButton.addEventListener("click", (e) => {
        e.stopPropagation();
        item.quantity--;

        if (item.quantity <= 0) {
            removeItem(id);
            updateButtonState(button, id);
        } else {
            updateCart();
            updateButtonState(button, id);
            saveCart();
        }
    });

    plusButton.addEventListener("click", (e) => {
        e.stopPropagation();
        item.quantity++;
        updateCart();
        updateButtonState(button, id);
        saveCart();
    });

    minusButton.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            minusButton.click();
        }
    });
    plusButton.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            plusButton.click();
        }
    });
}

function attachConfirmButton() {
    const confirmButton = document.querySelector("#confirm");
    if (!confirmButton) return;

    confirmButton.addEventListener("click", () => {
        if (cart.length === 0) return;

        const cartListHTML = cartList.innerHTML;
        modalCartList.innerHTML = cartListHTML;

        modalOverlay.style.display = "flex";
    });
}

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

        const quantityCart = document.createElement("p");
        quantityCart.classList.add("item-quantity");
        quantityCart.textContent = `${item.quantity}x`;

        const itemPrice = document.createElement("p");
        itemPrice.classList.add("item-price");
        itemPrice.textContent = `@$${item.price.toFixed(2)}`;

        const itemTotal = document.createElement("p");
        itemTotal.classList.add("item-total");
        itemTotal.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-btn");
        removeBtn.textContent = ""; 
        removeBtn.addEventListener("click", () => {
            removeItem(item.id);
        });
        
        li.appendChild(name);
        li.appendChild(quantityCart);
        li.appendChild(itemPrice);
        li.appendChild(itemTotal);
        li.appendChild(removeBtn);

        cartList.appendChild(li);
    });
    
    emptyCart.style.display = cart.length > 0 ? "none" : "block"
    cartTotal.innerHTML = `<span class="label">Order Total</span>
                        <span class="tot-value">$${total.toFixed(2)}</span>
                        <span class="obs-carbon">This is a <strong>carbon-neutral</strong> delivery</span>
                        <button id="confirm">Confirm Order</button>`;
    cartQuantity.textContent = totalItems;
    cartTotal.style.display = cart.length > 0 ? "flex" : "none";

    attachConfirmButton();
}

function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
        console.error("Error saving cart in localStorage:", err);
    }
}

function loadCart() {
    const saved = localStorage.getItem("cart");
    if (saved) {
        cart.splice(0, cart.length, ...JSON.parse(saved));
        updateCart();

        cart.forEach(item => {
            const button = document.querySelector(`button.addTo[data-id="${item.id}"]`);
            if (button) updateButtonState(button, item.id);
        });
    }
}
loadCart();

function removeItem(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
        resetButton(id);
        saveCart();
    }
}

function resetButton(id) {
    const button = document.querySelector(`button.addTo[data-id="${id}"]`);
    if (!button) return;

    button.classList.remove("added");
    button.innerHTML = `Add to Cart`;

    const productImage = document.querySelector(`img[data-id="${id}"]`);
    if (productImage) {
        productImage.classList.remove("in-cart");
    }
}