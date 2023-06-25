// Scroll
const scrollTopBtn = document.getElementById("scroll-top-btn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    scrollTopBtn.classList.remove("hidden");
  } else {
    scrollTopBtn.classList.add("hidden");
  }
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Navigation Active State
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    navLinks.forEach((link) => {
      link.classList.add("font-medium", "text-white");
      link.classList.remove("font-bold", "font-medium", "text-red-200");
    });
    link.classList.add("font-bold", "text-red-200");

    // Scroll to the target section with smooth behavior
    const targetId = event.target.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Toast
const showToast = (message) => {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  toastMessage.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
};

// Products & Categories
const generateRating = (rating, parentDiv) => {
  // Local function to create an image element
  const createStarImg = (imgSrc) => {
    const img = document.createElement("img");
    img.setAttribute("src", imgSrc);
    img.classList.add("h-4", "w-4");
    return img;
  };

  const rate = rating.rate;

  // Create the rating div
  const ratingDiv = document.createElement("div");
  ratingDiv.classList.add("flex", "items-center");

  // Determine the number of filled and empty stars based on the rating
  const filledStars = Math.floor(rate);
  const hasHalfStar = rate % 1 !== 0;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  // Create the image elements for filled stars
  for (let i = 0; i < filledStars; i++) {
    const img = createStarImg("assets/images/star.svg");
    ratingDiv.appendChild(img);
  }

  // Create the image element for the half star if applicable
  if (hasHalfStar) {
    const img = createStarImg("assets/images/half-star.svg");
    ratingDiv.appendChild(img);
  }

  // Create the image elements for empty stars
  for (let i = 0; i < emptyStars; i++) {
    const img = createStarImg("assets/images/nofill-star.svg");
    ratingDiv.appendChild(img);
  }

  // Create the paragraph element for the rating count
  const ratingCount = document.createElement("p");
  ratingCount.classList.add("text-sm", "text-gray-400");
  ratingCount.textContent = `(${rating.count.toString()})`;

  ratingDiv.appendChild(ratingCount);
  parentDiv.appendChild(ratingDiv);
};

const getCartData = () => {
  // Retrieve cart items from localStorage
  const cartItems = localStorage.getItem("cart");
  return cartItems ? JSON.parse(cartItems) : [];
};

const updateCartData = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const addToCart = (product) => {
  const cart = getCartData();
  const currentDate = new Date();

  // Check if the product with same Id already exists in the cart
  const productExists = cart.find((item) => item.id === product.id);

  if (productExists) {
    // If the product exists, increment its quantity
    productExists.quantity += 1;
    productExists.created = currentDate;
  } else {
    cart.push({ ...product, quantity: 1, created: currentDate });
  }

  // Sort the cart items based on the latest created datetime
  cart.sort((a, b) => new Date(b.created) - new Date(a.created));

  // Store the cart items in localStorage
  updateCartData(cart);
};

const generateProductCardElements = (data) => {
  const productList = document.getElementById("product-list");

  data.forEach((product) => {
    // Create the card div
    const cardDiv = document.createElement("div");
    cardDiv.classList.add(
      "flex",
      "flex-col",
      "shadow-md",
      "border",
      "rounded-md"
    );

    // Create the card header div
    const cardHeaderDiv = document.createElement("div");
    cardHeaderDiv.setAttribute("id", "card-header");
    cardHeaderDiv.classList.add("relative", "flex", "overflow-hidden");

    // Create the image element
    const image = document.createElement("img");
    image.classList.add(
      "mx-auto",
      "h-40",
      "w-60",
      "object-cover",
      "transform",
      "transition",
      "duration-300",
      "hover:scale-105"
    );
    image.style.maxHeight = "100%";
    image.style.maxWidth = "100%";
    image.src = product.image;
    image.alt = product.title;

    cardHeaderDiv.appendChild(image);

    // Create the card body div
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.setAttribute("id", "card-body");
    cardBodyDiv.classList.add("p-2");

    // Create the card title h3 element
    const title = document.createElement("h3");
    title.classList.add(
      "mt-2",
      "text-md",
      "line-clamp-1",
      "overflow-hidden",
      "text-overflow-ellipsis",
      "whitespace-nowrap",
      "break-words"
    );
    title.textContent = product.title;

    cardBodyDiv.appendChild(title);

    // Create the price element
    const price = document.createElement("p");
    price.classList.add("font-medium", "text-violet-900");
    price.textContent = `$${product.price.toString()}`;

    cardBodyDiv.appendChild(price);

    generateRating(product.rating, cardBodyDiv);

    // Create the card footer
    const cardFooterDiv = document.createElement("div");
    cardFooterDiv.setAttribute("id", "card-footer");
    cardFooterDiv.classList.add(
      "p-3",
      "border",
      "border-none",
      "bg-blue-400",
      "bg-opacity-10"
    );

    // Create the button element
    const button = document.createElement("button");
    button.classList.add(
      "border-none",
      "outline-none",
      "rounded-md",
      "shadow-md",
      "uppercase",
      "font-bold",
      "text-xs",
      "p-3",
      "bg-blue-400",
      "text-white",
      "float-right",
      "hover:bg-blue-500"
    );
    button.textContent = "Add to cart";

    button.addEventListener("click", () => {
      addToCart(product);
      showToast(`${product.title} added to cart!`);
    });

    // Append the button to the outer div
    cardFooterDiv.appendChild(button);

    cardDiv.appendChild(cardHeaderDiv);
    cardDiv.appendChild(cardBodyDiv);
    cardDiv.appendChild(cardFooterDiv);

    productList.appendChild(cardDiv);
  });
};

// Function to generate category elements
const generateCategoryElements = (data) => {
  const categories = document.getElementById("category-list");

  // Loop through the data and create elements for each category
  data.forEach((category) => {
    // Create the anchor tag
    const link = document.createElement("a");

    // Create the container div
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("relative", "cursor-pointer");

    // Create the image element
    const image = document.createElement("img");
    image.classList.add(
      "mx-auto",
      "h-auto",
      "w-auto",
      "brightness-50",
      "duration-300",
      "hover:brightness-100"
    );
    image.src = category.image;
    image.alt = category.name;

    // Create the paragraph element for the category name
    const name = document.createElement("p");
    name.classList.add(
      "pointer-events-none",
      "absolute",
      "top-1/2",
      "left-1/2",
      "w-11/12",
      "-translate-x-1/2",
      "-translate-y-1/2",
      "text-center",
      "text-white",
      "lg:text-xl",
      "font-semibold"
    );
    name.textContent = category.name;

    // Append the image and name elements to the categoryDiv
    categoryDiv.appendChild(image);
    categoryDiv.appendChild(name);

    // Append the categoryDiv to the anchor tag
    link.appendChild(categoryDiv);

    // Append the anchor tag to the categories
    categories.appendChild(link);
  });
};

// Function to get category list
const getCategories = async () => {
  try {
    const response = await fetch("assets/data/categories.json");
    const data = await response.json();
    // Call the generateCategoryElements based on response data
    generateCategoryElements(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to get best seller product list
const getProducts = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=8");
    const data = await response.json();
    // Call the generateCategoryElements based on response data
    generateProductCardElements(data);
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

getCategories();
getProducts();
