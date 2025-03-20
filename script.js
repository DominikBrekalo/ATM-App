document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const pinInput = document.getElementById("pin");
    const loginFormContainer = document.getElementById("loginFormContainer");
    const atmScreenContainer = document.getElementById("atmScreenContainer");
    const balanceDisplay = document.getElementById("balance");
    const transactionSection = document.getElementById("transactionSection");
    const transactionAmount = document.getElementById("transactionAmount");
    const submitTransaction = document.getElementById("submitTransaction");
    const transactionMessage = document.getElementById("transactionMessage");
    const checkBalanceBtn = document.getElementById("checkBalanceBtn");
    const depositBtn = document.getElementById("depositBtn");
    const withdrawBtn = document.getElementById("withdrawBtn");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const pin = pinInput.value.trim();
        if (!pin) {
            alert("Please enter a PIN.");
            return;
        }

        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pin }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loginFormContainer.style.display = "none";
                atmScreenContainer.style.display = "block";
            } else {
                alert("Invalid PIN. Try again.");
            }
        })
        .catch(error => {
            alert("Login failed. Check server connection.");
            console.error("Error:", error);
        });
    });

    // stanje racuna
    checkBalanceBtn.addEventListener("click", function () {
        fetch("http://localhost:3000/balance")
        .then(response => response.json())
        .then(data => {
            balanceDisplay.textContent = `Balance: €${data.balance}`;
            balanceDisplay.style.display = "block";
            transactionSection.style.display = "none";
        })
        .catch(error => console.error("Error:", error));
    });

    // uplata novca
    depositBtn.addEventListener("click", function () {
        transactionSection.style.display = "block";
        transactionAmount.placeholder = "Enter amount (€)";
        submitTransaction.dataset.type = "deposit";
    });

    // dizanje novca
    withdrawBtn.addEventListener("click", function () {
        transactionSection.style.display = "block";
        transactionAmount.placeholder = "Enter amount (€)";
        submitTransaction.dataset.type = "withdraw";
    });


    submitTransaction.addEventListener("click", function () {
        const amount = parseFloat(transactionAmount.value);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        const transactionType = submitTransaction.dataset.type;
        const endpoint = transactionType === "deposit" ? "deposit" : "withdraw";

        fetch(`http://localhost:3000/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                balanceDisplay.textContent = `Balance: €${data.balance}`;
                balanceDisplay.style.display = "block";
                transactionSection.style.display = "none";
                transactionAmount.value = ""; // vraca vrijednost na prazan string
            } else {
                alert("Transaction failed: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
