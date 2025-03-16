const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzm7hlpXldScyfyiKvIJUTYQPA_-JT1X0PIwjxAaFQSf38T7lr9WAC0fPpOxaM4QK6w/exec";

let allUsers = [];
let custodiansData = {}; // 存放每個物品的保管人清單

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
    itemSelect.innerHTML = '<option value="">請選擇物品📱</option>'; // 預設選項

    items.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        itemSelect.appendChild(option);
    });
}

// ✅ 載入所有使用者 + 保管人清單
async function loadUsersAndCustodians() {
    let data = await fetchFromAPI("getUsersAndCustodians");
    allUsers = data.users; // 所有使用者
    custodiansData = data.custodians; // 保管人對應物品的清單
}

// ✅ 當選擇物品時，優先顯示保管人
function loadUsersWithPriority(itemId) {
    let userSelect = document.getElementById("userId");
    userSelect.innerHTML = '<option value="">請選擇使用者</option>'; // 預設選項

    let prioritizedUsers = custodiansData[itemId] || []; // 取出該物品的保管人
    let otherUsers = allUsers.filter(user => !prioritizedUsers.includes(user)); // 其他使用者

    let finalUserList = prioritizedUsers.concat(otherUsers); // 先顯示保管人，再顯示其他人

    finalUserList.forEach(user => {
        let option = document.createElement("option");
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
    });
}

// ✅ 當頁面載入時，初始化數據
window.onload = async function () {
    await loadItems();
    await loadUsersAndCustodians();
};
