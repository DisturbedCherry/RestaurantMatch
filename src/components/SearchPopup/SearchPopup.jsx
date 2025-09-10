import { useEffect, useRef, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import styles from "./SearchPopup.module.css";

export default function SearchPopup({ open, onClose }) {
  const popupRef = useRef(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  // Firestore search
  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const q = query(
      collection(db, "restaurants"),
      where("nameOfRestaurant", ">=", search),
      where("nameOfRestaurant", "<=", search + "\uf8ff")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setResults(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [search]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div ref={popupRef} className={styles.popup}>
        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants..."
          className={styles.searchBar}
        />

        {/* Results */}
        <ul className={styles.results}>
            {results.length > 0 ? (
                results.map((r) => (
                <li
                    key={r.id}
                    className={styles.resultItem}
                    onClick={() => window.open(r.website, "_blank")} // <-- open in new tab
                >
                    {r.nameOfRestaurant}
                </li>
                ))
            ) : (
                <p className={styles.noResults}>No results</p>
            )}
        </ul>
      </div>
    </div>
  );
}
