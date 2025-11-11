import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const sendRequestToHelper = async (helperId, userId, category, location) => {
  try {
    await addDoc(collection(db, "requests"), {
      helperId,       // ID of the helper
      userId,         // ID of the user who requested
      category,       // service category like Plumbing
      location,       // { lat, lng } of user
      status: "pending", // request status
      createdAt: new Date(),
    });
    console.log(`Request sent to helper ${helperId}`);
  } catch (error) {
    console.error("Error sending request:", error);
  }
};
