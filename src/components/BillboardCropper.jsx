// src/components/BillboardCropper.jsx
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const BillboardCropper = ({ onCropComplete }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // 1. When the user selects a file from their computer
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };

  // 2. Save the coordinates as the user drags the image
  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 3. When they click "Lock it in", cut the image and send it up!
  const handleSaveCrop = async () => {
    try {
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImageFile); // Send the final file back to App.jsx
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', color: 'white' }}>
      
      {!imageSrc ? (
        <div style={{ padding: '40px', border: '2px dashed #38bdf8', borderRadius: '10px', textAlign: 'center' }}>
          <h3>Upload Your Ad Creative</h3>
          <input type="file" accept="image/*" onChange={onFileChange} style={{ marginTop: '10px' }} />
        </div>
      ) : (
        <>
          <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#0f172a', borderRadius: '10px', overflow: 'hidden' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9} // Forces standard 1080p Billboard ratio!
              onCropChange={setCrop}
              onCropComplete={onCropCompleteHandler}
              onZoomChange={setZoom}
            />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>Zoom</label>
            <input 
              type="range" value={zoom} min={1} max={3} step={0.1} 
              onChange={(e) => setZoom(e.target.value)} 
              style={{ width: '100%' }}
            />
            <button 
              onClick={handleSaveCrop}
              style={{ backgroundColor: '#22c55e', padding: '15px', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
            >
              Lock & Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to read the file
function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default BillboardCropper;