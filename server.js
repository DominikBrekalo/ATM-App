const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dataFile = "data.json";

// postavlja default data ako ih nema
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify({ pin: "1234", balance: 1000, transactions: [] }, null, 2)
    );
}

const loadUserData = () => JSON.parse(fs.readFileSync(dataFile));
const saveUserData = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

// provjera radi li server
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/login", (req, res) => {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ success: false, message: "PIN is required" });

    const userData = loadUserData();
    if (pin === userData.pin) {
        res.json({ success: true, message: "Login successful" });
    } else {
        res.status(401).json({ success: false, message: "Invalid PIN" });
    }
});

app.get("/balance", (req, res) => {
    const userData = loadUserData();
    res.json({ balance: userData.balance });
});

app.post("/withdraw", (req, res) => {
    const { amount } = req.body;
    const userData = loadUserData();

    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    if (amount > userData.balance) {
        return res.status(400).json({ success: false, message: "Insufficient funds" });
    }

    userData.balance -= amount;
    userData.transactions.push({ type: "withdraw", amount, date: new Date().toISOString() });
    saveUserData(userData);

    res.json({ success: true, balance: userData.balance });
});

app.post("/deposit", (req, res) => {
    const { amount } = req.body;
    const userData = loadUserData();

    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    userData.balance += amount;
    userData.transactions.push({ type: "deposit", amount, date: new Date().toISOString() });
    saveUserData(userData);

    res.json({ success: true, balance: userData.balance });
});

app.get("/transactions", (req, res) => {
    const userData = loadUserData();
    res.json({ transactions: userData.transactions });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));