// scripts/exportData.ts
import fs from "fs";
import path from "path";

// Replace this with however you get your transactions
const transactions = [
  { id: 1, name: "Example", amount: 100 },
  { id: 2, name: "Test", amount: 200 },
];

const filePath = path.join(__dirname, "../public/data", `investment_data_${new Date().toISOString().split("T")[0]}.json`);

fs.writeFileSync(filePath, JSON.stringify({ transactions }, null, 2));

console.log(`✅ File saved at: ${filePath}`);