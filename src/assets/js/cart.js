const confirmPopup = document.getElementById("confirm-popup");
const confirmOkBtn = document.getElementById("popup-ok-btn");
const confirmCancelBtn = document.getElementById("popup-cancel-btn");

const getCartData = () => {
  const cartItems = localStorage.getItem("cart");
  return cartItems ? JSON.parse(cartItems) : [];
};

const updateCartData = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  }
  return text;
};

const removeFromCart = (itemId) => {
  const cartItems = getCartData();
  const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
  updateCartData(updatedCartItems);
};

const updateCartItemQuantity = (itemId, newQuantity) => {
  const cartItems = getCartData();
  const itemIndex = cartItems.findIndex((item) => item.id === itemId);

  if (itemIndex !== -1) {
    if (newQuantity > 0) {
      cartItems[itemIndex].quantity = newQuantity;
      updateCartData(cartItems);
    } else {
      removeFromCart(itemId);
    }
  }
};

const showEmptyCardView = (parentContainer) => {
  const emptyCartContainer = document.createElement("div");
  emptyCartContainer.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "my-8"
  );

  const emptyImage = document.createElement("img");
  emptyImage.src =
    "https://media.istockphoto.com/id/861576608/vector/empty-shopping-bag-icon-online-business-vector-icon-template.jpg?s=612x612&w=0&k=20&c=I7MbHHcjhRH4Dy0NVpf4ZN4gn8FVDnwn99YdRW2x5k0=";
  emptyImage.classList.add("w-64", "h-64", "mb-4");

  const emptyMessage = document.createElement("p");
  emptyMessage.textContent = "Your cart is empty!";
  emptyMessage.classList.add("text-lg", "font-semibold");

  emptyCartContainer.appendChild(emptyImage);
  emptyCartContainer.appendChild(emptyMessage);
  parentContainer.appendChild(emptyCartContainer);
};

const confirmRemoveCart = (itemId) => {
  confirmPopup.classList.remove("hidden");
  confirmPopup.classList.add("flex");

  confirmCancelBtn.addEventListener("click", () => {
    confirmPopup.classList.add("hidden");
  });

  confirmOkBtn.addEventListener("click", () => {
    removeFromCart(itemId);
    confirmPopup.classList.add("hidden");
    generateDesktopCartElements();
    generateMobileCartElements();
    getOrderSummary();
  });
};

const generateDesktopCartItemRow = (item) => {
  const row = document.createElement("tr");
  row.classList.add("h-[100px]", "border-b");

  // Product image column
  const imageColumn = document.createElement("td");
  imageColumn.classList.add("align-middle");
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("flex");

  const image = document.createElement("img");
  image.classList.add("w-[80px]", "h-[85px]");
  image.src = item.image;
  image.alt = "Product Image";
  imageContainer.appendChild(image);

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("ml-3", "flex", "flex-col", "justify-center");

  const title = document.createElement("p");
  title.classList.add("text-md", "text-sky-600", "font-semibold", "p-6");
  title.textContent = truncateText(item.title, 30);

  detailsContainer.appendChild(title);
  imageContainer.appendChild(detailsContainer);
  imageColumn.appendChild(imageContainer);
  row.appendChild(imageColumn);

  // Price column
  const priceColumn = document.createElement("td");
  priceColumn.classList.add("mx-auto", "text-center");
  priceColumn.textContent = `$${item.price}`;
  row.appendChild(priceColumn);

  // Quantity column
  const quantityColumn = document.createElement("td");
  quantityColumn.classList.add("align-middle");

  const quantityContainer = document.createElement("div");
  quantityContainer.classList.add("flex", "items-center", "justify-center");

  const decreaseBtn = document.createElement("button");
  decreaseBtn.classList.add(
    "flex",
    "h-8",
    "w-8",
    "cursor-pointer",
    "items-center",
    "justify-center",
    "border",
    "duration-100",
    "hover:bg-neutral-100",
    "focus:ring-2",
    "focus:ring-gray-500",
    "active:ring-2",
    "active:ring-gray-500"
  );
  decreaseBtn.textContent = "-";
  decreaseBtn.addEventListener("click", () => {
    updateCartItemQuantity(item.id, item.quantity - 1);
    generateDesktopCartElements();
    generateMobileCartElements();
    getOrderSummary();
  });

  const quantityText = document.createElement("div");
  quantityText.classList.add(
    "flex",
    "h-8",
    "w-8",
    "cursor-text",
    "items-center",
    "justify-center",
    "border-t",
    "border-b",
    "active:ring-gray-500"
  );
  quantityText.textContent = item.quantity;

  const increaseBtn = document.createElement("button");
  increaseBtn.classList.add(
    "flex",
    "h-8",
    "w-8",
    "cursor-pointer",
    "items-center",
    "justify-center",
    "border",
    "duration-100",
    "hover:bg-neutral-100",
    "focus:ring-2",
    "focus:ring-gray-500",
    "active:ring-2",
    "active:ring-gray-500"
  );
  increaseBtn.textContent = "+";
  increaseBtn.addEventListener("click", () => {
    updateCartItemQuantity(item.id, item.quantity + 1);
    generateDesktopCartElements();
    generateMobileCartElements();
    getOrderSummary();
  });

  quantityContainer.appendChild(decreaseBtn);
  quantityContainer.appendChild(quantityText);
  quantityContainer.appendChild(increaseBtn);
  quantityColumn.appendChild(quantityContainer);
  row.appendChild(quantityColumn);

  // Subtotal column
  const subtotalColumn = document.createElement("td");
  subtotalColumn.classList.add("mx-auto", "text-center", "font-semibold");
  subtotalColumn.textContent = `$${item.price * item.quantity}`;
  row.appendChild(subtotalColumn);

  // Remove button column
  const removeBtnColumn = document.createElement("td");
  removeBtnColumn.classList.add("align-middle");
  const removeBtn = document.createElement("img");
  removeBtn.setAttribute("src", "assets/images/trash.svg");
  removeBtn.classList.add(
    "w-5",
    "h-5",
    "cursor-pointer",
    "transform",
    "transition",
    "duration-200",
    "hover:scale-110"
  );
  removeBtn.addEventListener("click", () => {
    confirmRemoveCart(item.id);
  });
  removeBtnColumn.appendChild(removeBtn);
  row.appendChild(removeBtnColumn);

  return row;
};

const generateDesktopCartElements = () => {
  const cartContainer = document.getElementById("cart-container");
  const cartItems = getCartData();

  // Clear existing content
  cartContainer.innerHTML = "";

  if (cartItems.length === 0) {
    showEmptyCardView(cartContainer);
  } else {
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("overflow-y-auto", "h-[620px]");

    const table = document.createElement("table");
    table.classList.add("table-fixed");

    const thead = document.createElement("thead");
    thead.classList.add("sticky", "top-0", "h-16", "bg-neutral-100");

    const headerRow = document.createElement("tr");
    const headerLabels = ["ITEM", "PRICE", "QUANTITY", "TOTAL", ""];
    headerLabels.forEach((label) => {
      const th = document.createElement("th");
      th.textContent = label;
      th.classList.add("px-6", "py-2");
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.id = "cart-items";

    cartItems.forEach((item) => {
      const cartItemRow = generateDesktopCartItemRow(item);
      tbody.appendChild(cartItemRow);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    cartContainer.appendChild(tableContainer);
  }
};

const generateMobileCartElements = () => {
  const cartContainer = document.getElementById("cart-mobile-container");
  const cartItems = getCartData();

  // Clear existing content
  cartContainer.innerHTML = "";

  if (cartItems.length === 0) {
    showEmptyCardView(cartContainer);
  } else {
    cartItems.forEach((item) => {
      const cartItemContainer = document.createElement("div");
      cartItemContainer.classList.add(
        "flex",
        "w-full",
        "border",
        "my-4",
        "px-4",
        "py-4",
        "shadow-md"
      );

      const imageContainer = document.createElement("div");
      imageContainer.classList.add("self-start", "w-[100px]", "h-[80px]");
      const image = document.createElement("img");
      image.classList.add("object-contain", "w-[100px]", "h-[80px]");
      image.setAttribute("src", item.image);
      image.setAttribute("alt", "product-img");
      imageContainer.appendChild(image);

      const detailsContainer = document.createElement("div");
      detailsContainer.classList.add(
        "ml-3",
        "flex",
        "w-full",
        "flex-col",
        "justify-center"
      );

      const titleContainer = document.createElement("div");
      titleContainer.classList.add("flex", "items-center", "justify-between");

      const title = document.createElement("p");
      title.classList.add("text-lg", "text-sky-600", "font-semibold");
      title.textContent = truncateText(item.title, 30);

      const removeBtn = document.createElement("img");
      removeBtn.setAttribute("src", "assets/images/trash.svg");
      removeBtn.classList.add("h-5", "w-5", "cursor-pointer");

      removeBtn.addEventListener("click", () => {
        confirmRemoveCart(item.id);
      });

      titleContainer.appendChild(title);
      titleContainer.appendChild(removeBtn);

      const price = document.createElement("p");
      price.classList.add("py-3", "text-lg", "font-semibold");
      price.textContent = `$${item.price * item.quantity}`;

      const quantityContainer = document.createElement("div");
      quantityContainer.classList.add(
        "mt-2",
        "flex",
        "w-full",
        "items-center",
        "justify-between"
      );

      const quantityButtonsContainer = document.createElement("div");
      quantityButtonsContainer.classList.add(
        "flex",
        "items-center",
        "justify-center"
      );

      const decreaseBtn = document.createElement("button");
      decreaseBtn.classList.add(
        "flex",
        "h-8",
        "w-8",
        "cursor-pointer",
        "items-center",
        "justify-center",
        "border",
        "duration-100",
        "hover:bg-neutral-100",
        "focus:ring-2",
        "focus:ring-gray-500",
        "active:ring-2",
        "active:ring-gray-500"
      );
      decreaseBtn.textContent = "-";
      decreaseBtn.addEventListener("click", () => {
        updateCartItemQuantity(item.id, item.quantity - 1);
        generateDesktopCartElements();
        generateMobileCartElements();
        getOrderSummary();
      });

      const quantity = document.createElement("div");
      quantity.classList.add(
        "flex",
        "h-8",
        "w-8",
        "cursor-text",
        "items-center",
        "justify-center",
        "border-t",
        "border-b",
        "active:ring-gray-500"
      );
      quantity.textContent = item.quantity;

      const increaseBtn = document.createElement("button");
      increaseBtn.classList.add(
        "flex",
        "h-8",
        "w-8",
        "cursor-pointer",
        "items-center",
        "justify-center",
        "border",
        "duration-100",
        "hover:bg-neutral-100",
        "focus:ring-2",
        "focus:ring-gray-500",
        "active:ring-2",
        "active:ring-gray-500"
      );
      increaseBtn.textContent = "+";
      increaseBtn.addEventListener("click", () => {
        updateCartItemQuantity(item.id, item.quantity + 1);
        generateDesktopCartElements();
        generateMobileCartElements();
        getOrderSummary();
      });

      quantityButtonsContainer.appendChild(decreaseBtn);
      quantityButtonsContainer.appendChild(quantity);
      quantityButtonsContainer.appendChild(increaseBtn);
      quantityContainer.appendChild(quantityButtonsContainer);

      detailsContainer.appendChild(titleContainer);
      detailsContainer.appendChild(price);
      detailsContainer.appendChild(quantityContainer);

      cartItemContainer.appendChild(imageContainer);
      cartItemContainer.appendChild(detailsContainer);

      cartContainer.appendChild(cartItemContainer);
    });
  }
};

const getOrderSummary = () => {
  const orderSummaryContainer = document.getElementById("order-summary");
  orderSummaryContainer.innerHTML = "";
  const cartItems = getCartData();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // Assume the shipping is free
  const shipping = 0;
  const total = subtotal + shipping;

  const orderSummaryLabel = document.createElement("p");
  orderSummaryLabel.classList.add("font-bold", "uppercase", "mb-4");
  orderSummaryLabel.textContent = "Order Summary";
  orderSummaryContainer.appendChild(orderSummaryLabel);

  const subtotalElement = document.createElement("div");
  subtotalElement.classList.add("flex", "justify-between", "border-b", "py-5");
  subtotalElement.innerHTML = `
      <p>Subtotal</p>
      <p>$${subtotal.toFixed(2)}</p>
    `;
  orderSummaryContainer.appendChild(subtotalElement);

  const shippingElement = document.createElement("div");
  shippingElement.classList.add(
    "flex",
    "justify-between",
    "border-b-2",
    "py-5"
  );
  shippingElement.innerHTML = `
      <p>Shipping</p>
      <p>Free</p>
    `;
  orderSummaryContainer.appendChild(shippingElement);

  const totalElement = document.createElement("div");
  totalElement.classList.add(
    "flex",
    "justify-between",
    "py-5",
    "font-bold",
    "text-blue-600"
  );
  totalElement.innerHTML = `
      <p>Total</p>
      <p>$${total.toFixed(2)}</p>
    `;
  orderSummaryContainer.appendChild(totalElement);

  const checkoutLink = document.createElement("a");
  const checkoutButton = document.createElement("button");
  checkoutButton.classList.add(
    "w-full",
    "bg-blue-500",
    "px-5",
    "py-2",
    "font-semibold",
    "text-white",
    "rounded-md",
    "shadow-md",
    "transition",
    "duration-200",
    "ease-in-out",
    "hover:bg-blue-400"
  );
  checkoutButton.textContent = "Proceed to checkout";
  if (cartItems.length === 0) {
    checkoutButton.setAttribute("disabled", "disabled");
    checkoutButton.classList.add("bg-slate-500");
    checkoutButton.classList.remove("hover:bg-blue-400");
  }

  checkoutLink.appendChild(checkoutButton);
  orderSummaryContainer.appendChild(checkoutLink);
};

generateDesktopCartElements();
generateMobileCartElements();
getOrderSummary();
