import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = "https://reb-backend.onrender.com";

export default function AssetTracker() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    serial: "",
    nomenclature: "",
    unit: "",
    location: ""
  });

  useEffect(() => {
    console.log("📥 Запит GET /assets...");
    fetch(`${API_BASE}/assets`)
      .then(res => {
        console.log("✅ GET /assets status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("🔁 GET /assets returned:", data);
        if (Array.isArray(data)) {
          setAssets(data);
        } else {
          alert("Помилка: GET /assets не повернув масив.");
        }
      })
      .catch(err => {
        console.error("❌ Помилка GET:", err);
        alert("Помилка завантаження даних.");
      });
  }, []);

  const handleAddAsset = async () => {
    console.log("📤 Надсилаємо:", form);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    try {
      const res = await fetch(`${API_BASE}/assets`, {
        method: "POST",
        body: formData
      });
      console.log("✅ POST status:", res.status);

      const data = await res.json();
      console.log("🔁 POST returned:", data);

      if (!res.ok || !data._id) {
        alert("Помилка при створенні: " + (data.error || data.details));
        return;
      }

      setAssets(prev => {
        console.log("📌 Перед оновленням стану, prev =", prev);
        const next = [...prev, data];
        console.log("📌 Після оновлення стану, next =", next);
        return next;
      });

      setForm({ name: "", serial: "", nomenclature: "", unit: "", location: "" });
      document.getElementById("modal").style.display = "none";

    } catch (err) {
      console.error("❌ Помилка POST:", err);
      alert("Помилка мережі при створенні.");
    }
  };

  return (
    <div>
      <h1>Облік засобів РЕБ</h1>
      <button onClick={() => document.getElementById("modal").style.display = "block"}>+ Додати засіб</button>

      <div id="modal" style={{ display: "none" }}>
        {["name", "serial", "nomenclature", "unit", "location"].map(f => (
          <input key={f} placeholder={f} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
        ))}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleAddAsset}>Зберегти</button>
          <button onClick={() => document.getElementById("modal").style.display = "none"}>Відхилити</button>
        </div>
      </div>

      <table>
        <thead>
          <tr><th>№</th><th>Найменування</th><th>Серійний</th><th>Номенклатура</th><th>Підрозділ</th></tr>
        </thead>
        <tbody>
          {assets.map((a, i) => (
            <tr key={a._id}>
              <td>{i + 1}</td>
              <td><Link to={`/passport/${a._id}`}>{a.name}</Link></td>
              <td>{a.serial}</td>
              <td>{a.nomenclature}</td>
              <td>{a.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
