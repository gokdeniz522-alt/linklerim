export const getFaviconUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    // Google'ın S2 Favicon servisini kullanarak güvenilir bir şekilde favicon alıyoruz.
    // sz=32 parametresi ikon boyutunu 32x32 piksel olarak ayarlar.
    return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=32`;
  } catch (error) {
    console.error("Favicon için geçersiz URL:", url, error);
    return ''; // Geçersiz URL durumunda boş string veya varsayılan bir placeholder döndürebiliriz.
  }
};