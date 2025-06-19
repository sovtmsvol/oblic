import { useState } from "react";
import { Link } from "react-router-dom";

let idCounter = 1;

export default function AssetTracker() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    serial: "",
    nomenclature: "",
    unit: "",
  });

  const handleAddAsset = () => {
    const newAsset = {
      id: idCounter++,
      ...form,
    };
    setAssets([...assets, newAsset]);
    setForm({ name: "", serial: "", nomenclature: "", unit: "" });
    document.getElementById('modal').style.display = 'none';
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
            <tr key={a.id} id={`row-${a.id}`}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/passport/${a.id}`}>{a.name}</Link>
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
