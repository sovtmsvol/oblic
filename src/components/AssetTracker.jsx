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
      .then(setAssets)
      .catch(console.error);
  }, []);

  const handleAddAsset = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    try {
      const res = await fetch(`${API_BASE}/assets`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data._id) {
        setAssets(prev => [...prev, data]);
        setForm({ name: "", serial: "", nomenclature: "", unit: "", location: "" });
        document.getElementById("modal").style.display = "none";
      } else {
        alert("Помилка при збереженні");
        console.error(data);
      }
    } catch (e) {
      console.error("Network error", e);
    }
  };

  const closeModal = () => document.getElementById('modal').style.display = 'none';

  return (
    <div>
      <h1>Облік засобів РЕБ</h1>

      <button onClick={() => document.getElementById('modal').style.display = 'block'}>
        + Додати засіб
      </button>

      <div id="modal" style={{ display: 'none' }}>
        {["name", "serial", "nomenclature", "unit", "location"].map(f => (
          <input key={f} placeholder={f} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
        ))}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleAddAsset}>Зберегти</button>
          <button onClick={closeModal}>Відхилити</button>
        </div>
      </div>

      <table>
        <thead>
          <tr><th>№</th><th>Найменування</th><th>Заводський номер</th><th>Номенклатура</th><th>Підрозділ</th></tr>
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
