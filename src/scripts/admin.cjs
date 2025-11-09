// admin.cjs

const admin = require("firebase-admin");
const fs = require("fs");

// Load JSON files using require() and fs
const serviceAccount = require("./serviceAccountKey.json");
const helpers = JSON.parse(fs.readFileSync("./helpers.json", "utf8"));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function addHelpers() {
  const batch = db.batch();

  helpers.forEach((helper) => {
    const ref = db.collection("helpers").doc();
    batch.set(ref, helper);
  });

  await batch.commit();
  console.log("✅ Helpers added successfully!");
}

addHelpers().catch((err) => {
  console.error("❌ Error adding helpers:", err);
});
