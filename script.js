const GAS_API_URL = "https://script.google.com/macros/s/AKfycbydBa5xdhDkJSEgoXpHql7tYY5dAPoE_7ppFjIO4WmOs4DDP7jt7iCHpQOhX-LYliZY/exec";

async function fetchFromAPI(action) {
    const response = await fetch(`${GAS_API_URL}?action=${action}`);
    return await response.json();
}

async function borrowItem() {
    let itemId = document.getElementById("itemId").value;
    let userId = document.getElementById("userId").value;

    if (!itemId || !userId) {
        alert("請選擇物品和使用者");
        return;
    }

    let response = await fetch(GAS_API_URL, {
        method: "POST",
        body: JSON.stringify({ itemId, userId }),
    }).then(res => res.json());

    document.getElementById("result").innerText = response.message;
}

async function loadItems() {
    let items = await fetchFromAPI("getAvailableItems");
    let itemSelect = document.getElementById("itemId");
    items.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        itemSelect.appendChild(option);
    });
}

window.onload = loadItems;

