import { useState } from "react";
import { useParams } from "react-router-dom"; // for paymentType param
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig"; // your firebase config

export default function AddRestaurantPage({ selectedPlan }) {
  const { paymentType } = useParams(); // get param from URL
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !website) {
      setStatus("Please fill in all required fields");
      return;
    }

    try {
      await addDoc(collection(db, "restaurants"), {
        nameOfRestaurant: name,
        website,
        description,
        paymentType,
        createdAt: new Date(),
      });
      setStatus("Restaurant added successfully!");
      setName("");
      setWebsite("");
      setDescription("");
    } catch (error) {
      console.error(error);
      setStatus("Error adding restaurant");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "12px" }}>
      <h2>Add Restaurant (Payment Type: {paymentType})</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <label>
          Restaurant Name *
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Website *
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
        </label>

        <button type="submit" style={{ padding: "12px", borderRadius: "8px", background: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
          Add Restaurant
        </button>
      </form>

      {status && <p style={{ marginTop: "16px" }}>{status}</p>}
    </div>
  );
}
