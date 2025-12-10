export async function preloadNextImage(imageUrl: string) {
  try {
    // Просто завантажуй оригіналльний URL без Next.js оптимізації
    const img = new Image();
    return new Promise((resolve) => {
      img.onload = () => resolve(undefined);
      img.onerror = () => resolve(undefined);
      img.src = imageUrl;
    });
  } catch (error) {
    console.error("Error preloading image:", error);
  }
}
