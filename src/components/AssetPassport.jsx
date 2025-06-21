import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE = "https://reb-backend.onrender.com";

export default function AssetPassport() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/assets/${id}`)
      .then(res => res.json())
      .then(setAsset)
      .catch(console.error);
  }, [id]);

  if (!asset) return <p>Завантаження...</p>;

  return (
    <div className="passport-container">
      <div className="passport-left">
        <h2>{asset.name}</h2>
        <p>Підрозділ: {asset.unit}</p>
        {asset.photo && <img src={`${API_BASE}${asset.photo}`} alt="Фото" className="asset-avatar" />}
        <p>Місцезнаходження: {asset.location}</p>
      </div>
      <div className="passport-right">
        <h3>Документи:</h3>
        {asset.documents?.map((doc, i) => (
          <div key={i} className="document-block">
            <p>№: {doc.number}</p>
            <p>Дата: {doc.date}</p>
            {doc.docFile && <a href={`${API_BASE}${doc.docFile}`} target="_blank" rel="noreferrer">📄 Док</a>}
            {doc.scanFile && <a href={`${API_BASE}${doc.scanFile}`} target="_blank" rel="noreferrer">🖼️ Скан</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
