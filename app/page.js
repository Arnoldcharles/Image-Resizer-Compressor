"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [resizedUrl, setResizedUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [resizedSize, setResizedSize] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setOriginalSize((file.size / 1024).toFixed(2)); // KB
  };

  const handleResizeDownload = () => {
    if (!image || !width || !height) return;

    const img = new Image();
    img.src = previewUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = parseInt(width);
      canvas.height = parseInt(height);

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.8); // 0.8 = 80% quality
      setResizedUrl(resizedDataUrl);

      const byteString = atob(resizedDataUrl.split(",")[1]);
      const length = byteString.length;
      setResizedSize((length / 1024).toFixed(2));

      const link = document.createElement("a");
      link.href = resizedDataUrl;
      link.download = "resized-image.jpg";
      link.click();
    };
  };

  return (
    <main className="container">
      <h1>Image Resizer + Compressor</h1>

      <button
        className="theme-toggle"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {previewUrl && (
        <>
          <img src={previewUrl} alt="Original preview" className="preview" />
          <div className="controls">
            <input
              type="number"
              placeholder="Width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
            <input
              type="number"
              placeholder="Height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <button onClick={handleResizeDownload}>Resize & Download</button>
          </div>
        </>
      )}

      {originalSize && <p>Original Size: {originalSize} KB</p>}

      {resizedSize && <p>Resized Size: {resizedSize} KB</p>}
    </main>
  );
}
