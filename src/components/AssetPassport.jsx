import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE = "https://reb-backend.onrender.com";

export default function AssetPassport() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [newDoc, setNewDoc] = useState({ number: '', date: '', docFile: null, scanFile: null });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/assets/${id}`)
      .then(res => res.json())
      .then(data => {
        setAsset(data);
        setDocuments(data.documents || []);
      });
  }, [id]);

  const handleDocChange = (field, value) => {
    setNewDoc({ ...newDoc, [field]: value });
  };

  const uploadDocument = async () => {
    const formData = new FormData();
    formData.append("number", newDoc.number);
    formData.append("date", newDoc.date);
    if (newDoc.docFile) formData.append("docFile", newDoc.docFile);
    if (newDoc.scanFile) formData.append("scanFile", newDoc.scanFile);

    const res = await fetch(`${API_BASE}/assets/${id}/documents`, {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      const updated = await fetch(`${API_BASE}/assets/${id}`).then(res => res.json());
      setAsset(updated);
      setDocuments(updated.documents);
      setNewDoc({ number: '', date: '', docFile: null, scanFile: null });
    }
  };

  const handlePreview = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  return (
    <div className="passport-container">
      {asset && (
        <>
          <div className="passport-left">
            {asset.photo && <img src={asset.photo} alt="Фото" className="asset-avatar" />}
            <h2>{asset.name}</h2>
            <p><b>Підрозділ:</b> {asset.unit}</p>
          </div>

          <div className="passport-right">
            <h3>Документи:</h3>
            <div className="document-blocks">
              {documents.map((doc, i) => (
                <div className="document-block" key={i}>
                  <div className="document-number">{i + 1}. {doc.number}</div>
                  <div>{doc.date}</div>
                  {doc.docFile && <button onClick={() => window.open(doc.docFile)}>📄</button>}
                  {doc.scanFile && <button onClick={() => window.open(doc.scanFile)}>🖼️</button>}
                </div>
              ))}
              <div className="document-block">
                <input type="text" placeholder="Номер документа" value={newDoc.number} onChange={e => handleDocChange('number', e.target.value)} />
                <input type="date" value={newDoc.date} onChange={e => handleDocChange('date', e.target.value)} />
                <label>Док:</label>
                <input type="file" onChange={e => handleDocChange('docFile', e.target.files[0])} />
                <label>Скан:</label>
                <input type="file" onChange={e => handleDocChange('scanFile', e.target.files[0])} />
                <button onClick={uploadDocument}>💾 Зберегти</button>
              </div>
            </div>
          </div>
        </>
      )}

      {previewUrl && (
        <div className="preview-overlay" onClick={() => setPreviewUrl(null)}>
          <div className="preview-modal">
            <iframe src={previewUrl} title="Документ" width="100%" height="100%"></iframe>
            <button className="close-preview">×</button>
          </div>
        </div>
      )}
    </div>
  );
}
