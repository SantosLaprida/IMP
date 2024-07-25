const admin = require("firebase-admin");
const fs = require("fs");

// Path to your service account key
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

// Function to import data from a JSON file into Firestore
const importData = async (jsonFilePath, collectionName) => {
	const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
	let batch = firestore.batch();
	let count = 0;

	for (let index = 0; index < data.rows.length; index++) {
		const item = data.rows[index];
		const docRef = firestore.collection(collectionName).doc();
		batch.set(docRef, item);
		count++;

		// Commit batch every 500 operations
		if ((index + 1) % 500 === 0) {
			try {
				await batch.commit();
				console.log(`Batch committed at index ${index + 1}`);
			} catch (error) {
				console.error(`Error committing batch at index ${index + 1}`, error);
			}
			batch = firestore.batch(); // Reinitialize the batch
		}
	}

	// Commit the remaining batch
	try {
		await batch.commit();
		console.log("Final batch committed");
		console.log(`Total documents processed: ${count}`);
	} catch (error) {
		console.error("Error committing final batch", error);
	}
	console.log(`Data successfully imported to ${collectionName}`);
};

// Import data for I_Torneos
const main = async () => {
	try {
		await importData("I_Torneos.json", "I_Torneos");
	} catch (error) {
		console.error("Error importing data", error);
	}
};

main();
