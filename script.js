const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxKPFV-JN6db0KuGbi53S5KKfmP6xpnkspzg7Da3Bec0UDmzq5KjZKFEFCz-D0M9GeV/exec";

let allUsers = [];
let custodiansData = {}; // 存放每個物品的保管人清單

// ✅ 取得 API 數據（支援 CORS）
async function fetchFromAPI(action) {
    try {
        console.log(`🚀 發送請求到 API: ${GAS_API_URL}?action=${action}`);
        const response = await fetch(`${GAS_API_URL}?action=${action}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        let result = await response.json();
        console.log(`✅ API 回應 (${action}):`, result);
        return result;
    } catch (error) {
        console.error(`❌ API 錯誤 (fetchFromAPI - ${action}):`, error);
        return { users: [], custodians: {} }; // 確保程式不會崩潰
    }
}


// ✅ 借用物品
async function borrowItem() {
    let itemId = document.getElementById("itemId").value;
    let userId = document.getElementById("userId").value;

    if (!itemId || !userId) {
        alert("❌ 請選擇物品和使用者");
        return;
    }

    try {
        console.log(`🚀 借用請求發送: itemId=${itemId}, userId=${userId}`);

        let response = await fetch(GAS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ itemId, userId })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        let result = await response.json();
        console.log("✅ 借用結果:", result.message);

        document.getElementById("result").innerText = result.message;

        // 借用成功後，重新載入可借用物品
        await loadItems();
    } catch (error) {
        console.error("❌ API 錯誤 (borrowItem):", error);
        document.getElementById("result").innerText = "❌ 無法提交借用請求，請稍後再試";
    }
}


// ✅ 載入可借用的物品
async function loadItems() {
    let items = await fetchFromAPI("getAvailableItems");
    let itemSelect = document.getElementById("itemId");

    itemSelect.innerHTML = '<option value="">📱 請選擇物品</option>'; // 預設選項
    items.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        itemSelect.appendChild(option);
    });

    console.log("📌 可借用物品:", items);
}

// ✅ 載入所有使用者 + 保管人清單
async function loadUsersAndCustodians() {
    let data = await fetchFromAPI("getUsersAndCustodians");

    if (!data || !data.users || !data.custodians) {
        console.error("❌ 錯誤: 無法獲取使用者與保管人資料", data);
        return;
    }

    allUsers = data.users; // 所有使用者
    custodiansData = data.custodians; // 保管人對應物品的清單

    console.log("📌 成功載入使用者:", allUsers);
    console.log("📌 成功載入保管人:", custodiansData);
}

// ✅ 當選擇物品時，優先顯示保管人
function loadUsersWithPriority(itemId) {
    let userSelect = document.getElementById("userId");
    userSelect.innerHTML = '<option value="">👤 請選擇使用者</option>'; // 預設選項

    let prioritizedUsers = custodiansData[itemId] || []; // 取得保管人列表
    let otherUsers = allUsers.filter(user => !prioritizedUsers.includes(user)); // 其他使用者

    let finalUserList = prioritizedUsers.concat(otherUsers); // 先顯示保管人，再顯示其他人

    finalUserList.forEach(user => {
        let option = document.createElement("option");
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
    });

    console.log("📌 當前物品:", itemId);
    console.log("📌 優先保管人:", prioritizedUsers);
    console.log("📌 其他使用者:", otherUsers);
}


// ✅ 當頁面載入時，初始化數據
window.onload = async function () {
    await loadItems();
    await loadUsersAndCustodians();
};


