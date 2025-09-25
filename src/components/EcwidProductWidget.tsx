import React, { useEffect } from 'react';

const EcwidProductWidget: React.FC = () => {
  useEffect(() => {
    // Ecwid ana script'inin zaten yüklenip yüklenmediğini kontrol et
    if (!document.getElementById('ecwid-script')) {
      const script = document.createElement('script');
      script.id = 'ecwid-script';
      script.src = 'https://app.ecwid.com/script.js?111242736&data_platform=singleproduct_v2';
      script.charset = 'utf-8';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      document.body.appendChild(script);

      script.onload = () => {
        // Ana script yüklendikten sonra xProduct() fonksiyonunu çağır
        if (typeof (window as any).xProduct === 'function') {
          (window as any).xProduct();
        }
      };
    } else {
      // Script zaten yüklüyse, widget'ı yeniden başlatmak için xProduct() çağır
      if (typeof (window as any).xProduct === 'function') {
        (window as any).xProduct();
      }
    }

    // Bu script'ler genellikle global olarak yüklendiği için özel bir temizleme işlemi yapmıyoruz.
    // Bileşen kaldırılsa bile script'ler sayfada kalabilir.
  }, []);

  return (
    <div 
      className="ecsp ecsp-SingleProduct-v2 ecsp-SingleProduct-v2-centered ecsp-Product ec-Product-784637578" 
      itemScope 
      itemType="http://schema.org/Product" 
      data-single-product-id="784637578"
    >
      <div itemProp="image"></div>
      <div className="ecsp-title" itemProp="name" content="linkkoy pro"></div>
      <div itemType="http://schema.org/Offer" itemScope itemProp="offers">
        <div className="ecsp-productBrowser-price ecsp-price" itemProp="price" content="10" data-spw-price-location="button">
          <div itemProp="priceCurrency" content="TRY"></div>
        </div>
      </div>
      <div customprop="options"></div>
      <div customprop="addtobag"></div>
      <div customprop="vatinprice"></div>
    </div>
  );
};

export default EcwidProductWidget;