import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE = "https://reb-backend.onrender.com";

export default function AssetPassport() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/assets/${id}`)
      .then(res => res.json())
      .then(data => {
        setAsset(data);
        setLocation(data.location || '');
        setPhotoUrl(data.photo || '');
        setDocuments(data.documents || []);
      });
  }, [id]);

  const updateAsset = async (updatedFields) => {
    const res = await fetch(`${API_BASE}/assets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });

    if (res.ok) {
      const updated = await res.json();
      setAsset(updated);
    }
  };

  const handleLocationChange = (e) => {
    const newLoc = e.target.value;
    setLocation(newLoc);
    updateAsset({ location: newLoc });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch(`${API_BASE}/assets/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (res.ok) {
      const updated = await res.json();
      setPhotoUrl(updated.photo);
    }
  };

  const handlePreview = (file) => {
    if (file) {
      const url = typeof file === "string" ? file : URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const closePreview = () => setPreviewUrl(null);

  return (
    <>
      <Link to="/" className="btn-back">← На головну</Link>

      <div className="passport-container">
        <div className="passport-left">
          <label>Фото засобу:</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          {photoUrl && <img src={photoUrl} alt="Asset" className="asset-avatar" />}
          {asset && <h2>{asset.name}</h2>}

          <label>Актуальне місцезнаходження:</label>
          <input
            type="text"
            placeholder="Введіть підрозділ"
            value={location}
            onChange={handleLocationChange}
          />
        </div>

        <div className="passport-right">
          <h3>Порядок перебування засобу в бригаді</h3>
          <div className="document-blocks">
            {documents.map((doc, index) => (
              <div key={index} className="document-block">
                <div className="document-number">{index + 1}</div>
                <div><strong>№:</strong> {doc.number}</div>
                <div><strong>Дата:</strong> {doc.date}</div>
                {doc.docFile && (
                  <button type="button" className="view-icon" onClick={() => handlePreview(doc.docFile)}>
                    📄 Перегляд документа
                  </button>
                )}
                {doc.scanFile && (
                  <button type="button" className="view-icon" onClick={() => handlePreview(doc.scanFile)}>
                    🖼️ Перегляд скану
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {previewUrl && (
          <div className="preview-overlay" onClick={closePreview}>
            <div className="preview-modal">
              <iframe src={previewUrl} title="Документ" frameBorder="0" width="100%" height="100%"></iframe>
              <button className="close-preview" onClick={closePreview}>×</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
