/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const selectedProductWindow = document.getElementById("selectedProductsList");
const generateRoutineButton = document.getElementById("generateRoutine");
const workerURL = "https://mute-hill-84d7.archergames7.workers.dev/";
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

/* Generate routine button click handler - placeholder for future functionality */
generateRoutineButton.addEventListener("click", () => {
  chatWindow.innerHTML = "Connecting to the OpenAI API for a response!";

  prompt =
    "You are a helpful assistant that helps users with personalized routines. Only mention selected L’Oréal products and services in your responses. Always ask follow-up questions to better understand the user’s needs and preferences, and provide detailed, informative answers that highlight the unique features and benefits of L’Oréal’s offerings. Be friendly, engaging, and professional in your tone. If the user asks a question that is not related to L’Oréal products or services, politely steer the conversation back to topics related to L’Oréal and do not provide information on unrelated topics.";

  productsList = selectedProducts.map((product) => `- ${product}`).join("\n");
  prompt += `\n\nThe user has selected the following products:\n${productsList}`;

  try {
    fetch(workerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: userInput.value,
          },
          {
            role: "system",
            content: prompt,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let message = `<li>L’Oréal Assistant: ${data.choices[0].message.content}</li>`;
        chatWindow.innerHTML = message;
      })
      .catch((error) => {
        console.error("Error:", error);
        chatWindow.textContent =
          "An error occurred while fetching the response.";
      });
  } catch (error) {
    console.error("Error:", error);
    chatWindow.textContent = "An error occurred while fetching the response.";
  }
});

/* Chat form submission handler - placeholder for OpenAI integration */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  prompt =
    "You are a helpful assistant that helps users discover and understand L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations. Only mention L’Oréal products and services in your responses. If you don’t know the answer, say you don’t know. Always ask follow-up questions to better understand the user’s needs and preferences, and provide detailed, informative answers that highlight the unique features and benefits of L’Oréal’s offerings. Be friendly, engaging, and professional in your tone. If the user asks a question that is not related to L’Oréal products or services, politely steer the conversation back to topics related to L’Oréal and do not provide information on unrelated topics.";

  productsList = selectedProducts.map((product) => `- ${product}`).join("\n");
  prompt += `\n\nThe user has selected the following products:\n${productsList}`;
  prompt += `\n\nThis is the chat history: ${chatWindow.textContent}`;
  userMessage = document.createElement("li");
  userMessage.textContent = `You: ${userInput.value}`;
  chatWindow.appendChild(userMessage);

  try {
    fetch(workerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: userInput.value,
          },
          {
            role: "system",
            content: prompt,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        assistantMessage = document.createElement("li");
        assistantMessage.textContent = `L’Oréal Assistant: ${data.choices[0].message.content}`;
        chatWindow.appendChild(assistantMessage);
      })
      .catch((error) => {
        console.error("Error:", error);
        chatWindow.textContent =
          "An error occurred while fetching the response.";
      });
  } catch (error) {
    console.error("Error:", error);
    chatWindow.textContent = "An error occurred while fetching the response.";
  }
});
