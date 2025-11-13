import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/ImageUploader.css';

export const ImageUploader = ({ onUpload, reset }) => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  // Limpiar estado si se pasa reset = true
  useEffect(() => {
    if (reset) {
      setImagePreview(null);
      setMessage('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUpload) onUpload('');
    }
  }, [reset, onUpload]);

  const resetState = () => {
    setImagePreview(null);
    setMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUpload) onUpload('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setMessage(t('form.noImage'));
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      setMessage(t('form.uploading'));

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setMessage(t('form.successImg'));
        setTimeout(() => setMessage(""), 3000);
        if (onUpload) onUpload(data.secure_url);
      } else {
        setMessage(t('form.errorImg'));
      }
    } catch (error) {
      setMessage(t('form.errorImg') + ': ' + error);
    }
  };

  return (
    <div className="image-uploader">

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {imagePreview && (
        <div className="preview-container">
          <img src={imagePreview} alt="Vista previa" className="preview-img" />
          <button type="button" onClick={resetState}>
            {t('form.remove')}
          </button>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ImageUploader;
