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

        updateButtonState(button, id);


        updateCart();
    });
});

function updateButtonState(button, id) {
    const item = cart.find(i => i.id === id);

    if(!item) {
        button.innerHTML = `<span class="icon-add"></span> Add to Cart`;
        button.classList.remove("added");
        return
    }

    button.classList.add("added");
    button.textContent = "";
    button.innerHTML = `<div class="qty-controls">
                        <span class="minus" role="button" tabindex="0"></span>
                        <span class="qty">${item.quantity}</span>
                        <span class="plus" role="button" tabindex="0"></span>
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
        }
    });

    plusButton.addEventListener("click", (e) => {
        e.stopPropagation();
        item.quantity++;
        updateCart();
        updateButtonState(button, id);
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
    
    emptyCart.style.display = cart.length > 0 ? "none" : "block"
    cartTotal.textContent = `Order Total $${total.toFixed(2)}`;
    cartQuantity.textContent = totalItems;
    cartTotal.style.display = cart.length > 0 ? "block" : "none";
}

function removeItem(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
        resetButton(id);
    }
}

function resetButton(id) {
    const button = document.querySelector(`button.addTo[data-id="${id}"]`);
    if (!button) return;

    button.classList.remove("added");
    button.innerHTML = `Add to Cart`;
}