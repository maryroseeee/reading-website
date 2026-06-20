const COVER_ASPECT_RATIO = 2 / 3;
const COVER_WIDTH = 600;
const COVER_HEIGHT = 900;
const COVER_QUALITY = 0.94;

export function createCoverDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read cover image"));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Cover image did not load"));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error("Could not load cover image"));
      img.onload = () => {
        const imgW = img.naturalWidth || img.width;
        const imgH = img.naturalHeight || img.height;
        let cropW = imgW;
        let cropH = imgH;

        if (imgW / imgH > COVER_ASPECT_RATIO) {
          cropW = imgH * COVER_ASPECT_RATIO;
        } else {
          cropH = imgW / COVER_ASPECT_RATIO;
        }

        const canvas = document.createElement("canvas");
        canvas.width = COVER_WIDTH;
        canvas.height = COVER_HEIGHT;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not prepare cover image"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          (imgW - cropW) / 2,
          (imgH - cropH) / 2,
          cropW,
          cropH,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        resolve(canvas.toDataURL("image/jpeg", COVER_QUALITY));
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}
