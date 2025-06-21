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
  fetch(`${API_BASE}/assets`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setAssets(data);
      } else {
        console.error("❌ Очікував масив, отримав:", data);
        alert("Помилка завантаження. Дані з сервера мають невірний формат.");
      }
    })
    .catch(err => {
      console.error("❌ Помилка запиту:", err);
      alert("Помилка звʼязку з сервером.");
    });
}, []);

const handleAddAsset = async () => {
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => formData.append(key, value));

  try {
    const res = await fetch(`${API_BASE}/assets`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data || !data._id) {
      console.error("❌ Невдала відповідь:", data);
      alert("Не вдалося створити засіб: " + (data.details || data.error || "невідома помилка"));
      return;
    }

    setAssets(prev => [...prev, data]);
    setForm({ name: "", serial: "", nomenclature: "", unit: "", location: "" });
    document.getElementById('modal').style.display = 'none';
  } catch (err) {
    console.error("❌ Запит не виконано:", err);
    alert("Помилка мережі.");
  }
};



  const closeModal = () => {
    document.getElementById('modal').style.display = 'none';
  };

  return (
    <div>
      <h1>Облік засобів РЕБ</h1>

      <button onClick={() => document.getElementById('modal').style.display = 'block'}>
        + Додати засіб
      </button>

      <div id="modal" style={{ display: 'none' }}>
        <input
          placeholder="Найменування"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Заводський номер"
          value={form.serial}
          onChange={(e) => setForm({ ...form, serial: e.target.value })}
        />
        <input
          placeholder="Номенклатура"
          value={form.nomenclature}
          onChange={(e) => setForm({ ...form, nomenclature: e.target.value })}
        />
        <input
          placeholder="Підрозділ"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />
        <input
          placeholder="Місцезнаходження"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleAddAsset}>Зберегти</button>
          <button onClick={closeModal}>Відхилити</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Найменування</th>
            <th>Заводський номер</th>
            <th>Номенклатура</th>
            <th>Підрозділ</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a, index) => (
            <tr key={a._id} id={`row-${a._id}`}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/passport/${a._id}`}>{a.name}</Link>
              </td>
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
