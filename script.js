/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const selectedProductWindow = document.getElementById("selectedProductsList");
let selectedProducts = [];

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
      </div>
    </div>
  `,
    )
    .join("");
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  const selectedCategory = e.target.value;

  /* filter() creates a new array containing only products 
     where the category matches what the user selected */
  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory,
  );

  displayProducts(filteredProducts);
  for (const card of document.querySelectorAll(".product-card")) {
    if (
      selectedProducts.includes(
        `${card.querySelector("p").textContent} ${card.querySelector("h3").textContent}`,
      )
    ) {
      card.style.border = "2px solid #007BFF"; // Highlight selected products
      card.style.backgroundColor = "#f0f8ff"; // Optional: change background for better visibility
    }
  }
});

/* Click listener for product cards to selecte products */
productsContainer.addEventListener("click", (e) => {
  const productCard = e.target.closest(".product-card");
  if (
    !selectedProducts.includes(
      `${productCard.querySelector("p").textContent} ${productCard.querySelector("h3").textContent}`,
    )
  ) {
    const productName = productCard.querySelector("h3").textContent;
    const productBrand = productCard.querySelector("p").textContent;
    const productImage = productCard.querySelector("img").src;

    productCard.style.border = "2px solid #007BFF"; // Highlight selected product
    productCard.style.backgroundColor = "#f0f8ff"; // Optional: change background for better visibility

    /* Create a new list item for the selected product */
    const listItem = `
    <div class="selected product-card">
      <img src="${productImage}" alt="${productName}">
      <div class="product-info">
        <h3>${productName}</h3>
        <p>${productBrand}</p>
      </div>
    </div>
    `;
    selectedProductWindow.insertAdjacentHTML("beforeend", listItem);
    selectedProducts.push(`${productBrand} ${productName}`);
  } else {
    productCard.style.border = "1px solid #ccc"; // Remove highlight
    productCard.style.backgroundColor = ""; // Reset background color

    /* Remove the product from the selected products list */
    selectedProducts = selectedProducts.filter(
      (product) =>
        product !==
        `${productCard.querySelector("p").textContent} ${productCard.querySelector("h3").textContent}`,
    );
    const listItems =
      selectedProductWindow.querySelectorAll("div.product-card");
    listItems.forEach((item) => {
      if (
        item.querySelector("h3").textContent ===
          productCard.querySelector("h3").textContent &&
        item.querySelector("p").textContent ===
          productCard.querySelector("p").textContent
      ) {
        selectedProductWindow.removeChild(item);
      }
    });
  }
});

/* Chat form submission handler - placeholder for OpenAI integration */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});
