import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AssetPassport() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [documents, setDocuments] = useState([{ number: '', date: '', docFile: null, scanFile: null }]);
  const [location, setLocation] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("assets")) || [];
    const found = localData.find((a) => a.id === Number(id));
    setAsset(found);
    if (found?.unit) setLocation(found.unit);
  }, [id]);

  const handleDocumentChange = (index, field, value) => {
    const newDocs = [...documents];
    newDocs[index][field] = value;
    setDocuments(newDocs);
  };

  const addDocumentBlock = () => {
    setDocuments([...documents, { number: '', date: '', docFile: null, scanFile: null }]);
  };

  const removeDocumentBlock = (index) => {
    const updated = [...documents];
    updated.splice(index, 1);
    setDocuments(updated);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const closePreview = () => setPreviewUrl(null);

  return (
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
          onChange={(e) => setLocation(e.target.value)}
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
  );
}