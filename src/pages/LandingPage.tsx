import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Palette, BarChart3, Share2 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="container mx-auto py-4 px-4 flex justify-between items-center z-10">
        <Link to="/" className="text-xl font-bold">
          LinkHub
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Giriş Yap</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Kaydol</Link>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 -z-10"></div>
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
                  Tüm Dijital Varlığınız,
                </span>
                <br />
                Tek Bir Linkte.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
                Tüm sosyal medya hesaplarınızı, portfolyonuzu ve önemli linklerinizi tek bir çatı altında toplayın. Takipçileriniz için şık, özelleştirilebilir ve akılda kalıcı bir sayfa oluşturun.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-8">
                <Button asChild size="lg" className="px-8 py-3 text-lg">
                  <Link to="/signup">Ücretsiz Başla</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              {/* Phone Mockup */}
              <div className="relative w-72 h-[36rem] bg-gray-800 dark:bg-black rounded-[2.5rem] border-[14px] border-gray-800 dark:border-black shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-gray-800 dark:bg-black rounded-b-xl"></div>
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-[1.8rem] overflow-hidden p-4 flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full mt-8"></div>
                  <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-full h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg mt-4"></div>
                  <div className="w-full h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
                  <div className="w-full h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-100 dark:bg-gray-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Her Şey Kontrolünüz Altında</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Sayfanızı markanıza ve tarzınıza uyacak şekilde kolayca kişiselleştirin.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-background rounded-lg shadow-sm">
                <Palette className="h-10 w-10 mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-xl font-semibold mb-2">Tam Özelleştirme</h3>
                <p className="text-muted-foreground">Renkler, arka planlar ve daha fazlasıyla sayfanızı tamamen kendinize özgü hale getirin.</p>
              </div>
              <div className="p-8 bg-background rounded-lg shadow-sm">
                <BarChart3 className="h-10 w-10 mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-xl font-semibold mb-2">Link Analizi</h3>
                <p className="text-muted-foreground">Hangi linklerinizin en çok tıklandığını görün ve kitlenizi daha iyi anlayın.</p>
              </div>
              <div className="p-8 bg-background rounded-lg shadow-sm">
                <Share2 className="h-10 w-10 mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-xl font-semibold mb-2">Kolay Paylaşım</h3>
                <p className="text-muted-foreground">Benzersiz linkinizi sosyal medya biyografilerinizde, e-postalarınızda ve her yerde paylaşın.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MadeWithDyad />
    </div>
  );
};

export default LandingPage;