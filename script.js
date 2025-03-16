const GAS_API_URL = "https://script.google.com/macros/s/AKfycbydBa5xdhDkJSEgoXpHql7tYY5dAPoE_7ppFjIO4WmOs4DDP7jt7iCHpQOhX-LYliZY/exec";

// ✅ 取得 API 數據
async function fetchFromAPI(action) {
    const response = await fetch(`${GAS_API_URL}?action=${action}`);
    return await response.json();
}

// ✅ 借用物品
async function borrowItem() {
    let itemId = document.getElementById("itemId").value;
    let userId = document.getElementById("userId").value;

    if (!itemId || !userId) {
        alert("請選擇物品和使用者");
        return;
    }

    let response = await fetch(GAS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, userId })
    }).then(res => res.json());

    document.getElementById("result").innerText = response.message;
}

// ✅ 載入可借用的物品
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

// ✅ 載入使用者清單
async function loadUsers() {
    let usersData = await fetchFromAPI("getUsersAndCustodians");
    let userSelect = document.getElementById("userId");
    usersData.users.forEach(user => {
        let option = document.createElement("option");
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
    });
}

// ✅ 當頁面載入時初始化
window.onload = async function () {
    await loadItems();
    await loadUsers();
};

