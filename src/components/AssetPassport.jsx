import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE = "https://reb-backend.onrender.com";

export default function AssetPassport() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [location, setLocation] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/assets/${id}`)
      .then(res => res.json())
      .then(data => {
        setAsset(data);
        setLocation(data.location || '');
        setPhoto(data.photo || null);
        setDocuments(data.documents || []);
      });
  }, [id]);

  const handleDocumentChange = (index, field, value) => {
    const updated = [...documents];
    updated[index][field] = value;
    setDocuments(updated);
    setHasChanges(true);
  };

  const addDocumentBlock = () => {
    setDocuments([...documents, { number: '', date: '', docFile: null, scanFile: null }]);
    setHasChanges(true);
  };

  const removeDocumentBlock = (index) => {
    const updated = [...documents];
    updated.splice(index, 1);
    setDocuments(updated);
    setHasChanges(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
      setHasChanges(true);
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setHasChanges(true);
  };

  const handlePreview = (file) => {
    const url = typeof file === "string" ? file : URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const closePreview = () => setPreviewUrl(null);

  const handleSave = async () => {
    if (!hasChanges) {
      alert("Немає змін для збереження.");
      return;
    }

    const formData = new FormData();
    formData.append("location", location);
    if (photoFile) formData.append("photo", photoFile);
    formData.append("documents", JSON.stringify(documents.map(d => ({
      number: d.number,
      date: d.date
    }))));

    documents.forEach((doc, i) => {
      if (doc.docFile) formData.append(`docFile_${i}`, doc.docFile);
      if (doc.scanFile) formData.append(`scanFile_${i}`, doc.scanFile);
    });

    const res = await fetch(`${API_BASE}/assets/${id}`, {
      method: "PATCH",
      body: formData
    });

    if (res.ok) {
      alert("✅ Дані успішно збережено!");
      setHasChanges(false);
    } else {
      alert("❌ Помилка при збереженні.");
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Link to="/" className="btn-back">← На головну</Link>
        <button className="add-document" onClick={handleSave}>💾 Зберегти всі зміни</button>
      </div>

      <div className="passport-container">
        <div className="passport-left">
          <label>Фото засобу:</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          {photo && <img src={photo} alt="Asset" className="asset-avatar" />}
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
                <button className="close-doc" onClick={() => removeDocumentBlock(index)}>×</button>
                <div className="document-number">{index + 1}</div>
                <input
                  type="text"
                  placeholder="Номер документа"
                  value={doc.number}
                  onChange={(e) => handleDocumentChange(index, 'number', e.target.value)}
                />
                <input
                  type="date"
                  value={doc.date}
                  onChange={(e) => handleDocumentChange(index, 'date', e.target.value)}
                />
                <label>Документ (Word/PDF):</label>
                {!doc.docFile && (
                  <input
                    type="file"
                    accept=".doc,.docx,.pdf"
                    onChange={(e) => handleDocumentChange(index, 'docFile', e.target.files[0])}
                  />
                )}
                {doc.docFile && (
                  <button type="button" className="view-icon" onClick={() => handlePreview(doc.docFile)}>
                    📄 Перегляд
                  </button>
                )}
                <label>Скан документа (зображення):</label>
                {!doc.scanFile && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleDocumentChange(index, 'scanFile', e.target.files[0])}
                  />
                )}
                {doc.scanFile && (
                  <button type="button" className="view-icon" onClick={() => handlePreview(doc.scanFile)}>
                    🖼️ Перегляд
                  </button>
                )}
                {index < documents.length - 1 && <div className="document-arrow">→</div>}
              </div>
            ))}
            <button className="add-document" onClick={addDocumentBlock}>+</button>
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
