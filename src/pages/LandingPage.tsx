import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MadeWithDyad } from '@/components/made-with-dyad';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto py-4 px-4 flex justify-end relative z-10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-24">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center max-w-6xl">
          {/* Sol Taraf: Metin İçerikleri */}
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Tüm Dijital Kimliğiniz Tek Bir Linkte
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
              Sosyal medya profillerinizden kişisel web sitelerinize, projelerinize ve daha fazlasına kadar tüm önemli linklerinizi tek, şık ve özelleştirilebilir bir sayfada toplayın.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-8">
              <Button asChild size="lg" className="px-8 py-3 text-lg">
                <Link to="/signup">Hemen Ücretsiz Kaydol</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg">
                <Link to="/login">Giriş Yap</Link>
              </Button>
            </div>
          </div>

          {/* Sağ Taraf: Görsel Alanı */}
          <div className="flex justify-center md:justify-end">
            <img
              src="/placeholder.PNG" // Uygulamanızı temsil eden bir görsel buraya gelebilir
              alt="Linklerinizi tek bir yerde toplayın"
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </main>

      <MadeWithDyad />
    </div>
  );
};

export default LandingPage;