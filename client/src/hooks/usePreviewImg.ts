import { useState } from "react";

const usePreviewImg = () => {
  const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>(
    null
  );

  const handlePreviewImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!file.type.includes("image"))
      return alert("Please select an image file");
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImg(e.target?.result || null);
    };
    reader.readAsDataURL(file);
  };

  return { previewImg, setPreviewImg, handlePreviewImg };
};

export default usePreviewImg;
