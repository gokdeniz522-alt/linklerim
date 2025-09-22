import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Palette, BarChart3, Share2, Sparkles, Rocket, LayoutGrid, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="container mx-auto py-4 px-4 flex justify-between items-center z-10">
        <Link to="/" className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
          Linkkoy
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
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 -z-10 opacity-75"></div>
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5" style={{ backgroundImage: 'url(/placeholder.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-center md:text-left space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">
                  Tüm Dijital Varlığınız,
                </span>
                <br />
                Tek Bir <span className="text-indigo-600 dark:text-indigo-400">Linkte</span>.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
                Sosyal medya hesaplarınızı, portfolyonuzu ve önemli linklerinizi tek bir şık sayfada toplayın. Takipçileriniz için akılda kalıcı bir deneyim yaratın.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-8">
                <Button asChild size="lg" className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-shadow">
                  <Link to="/signup">Ücretsiz Başla <Sparkles className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg">
                  <Link to="/dashboard">Demoyu Gör</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center relative">
              {/* Enhanced Phone Mockup */}
              <div className="relative w-72 h-[36rem] bg-gray-800 dark:bg-black rounded-[2.5rem] border-[14px] border-gray-800 dark:border-black shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-gray-800 dark:bg-black rounded-b-xl"></div>
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-[1.8rem] overflow-hidden p-4 flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full mt-8 animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-full h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg mt-4 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-medium">
                    <LinkIcon className="h-5 w-5 mr-2" /> Sosyal Medya
                  </div>
                  <div className="w-full h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg flex items-center justify-center text-cyan-700 dark:text-cyan-300 font-medium">
                    <LinkIcon className="h-5 w-5 mr-2" /> Portfolyo
                  </div>
                  <div className="w-full h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-700 dark:text-purple-300 font-medium">
                    <LinkIcon className="h-5 w-5 mr-2" /> Blog
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Nasıl Çalışır?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Linkkoy ile dijital varlığınızı oluşturmak sadece birkaç adımda!
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <Rocket className="h-12 w-12 text-indigo-500 dark:text-indigo-400 mb-4" />
                  <CardTitle className="text-xl font-semibold">1. Hesap Oluştur</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Hızlı ve ücretsiz bir şekilde kaydolun. Sadece birkaç saniyenizi alır.</p>
                </CardContent>
              </Card>
              <Card className="p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <LayoutGrid className="h-12 w-12 text-cyan-500 dark:text-cyan-400 mb-4" />
                  <CardTitle className="text-xl font-semibold">2. Sayfanı Tasarla</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Linklerini ekle, profilini özelleştir, temalar ve arka planlarla kişiselleştir.</p>
                </CardContent>
              </Card>
              <Card className="p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <Share2 className="h-12 w-12 text-purple-500 dark:text-purple-400 mb-4" />
                  <CardTitle className="text-xl font-semibold">3. Paylaşmaya Başla</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Benzersiz Linkkoy URL'ini tüm platformlarda paylaş ve takipçilerinle buluş.</p>
                </CardContent>
              </Card>
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
              <Card className="p-8 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Palette className="h-10 w-10 mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-xl font-semibold mb-2">Tam Özelleştirme</h3>
                <p className="text-muted-foreground">Renkler, arka planlar, yazı tipleri ve daha fazlasıyla sayfanızı tamamen kendinize özgü hale getirin.</p>
              </Card>
              <Card className="p-8 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <BarChart3 className="h-10 w-10 mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-xl font-semibold mb-2">Link Analizi</h3>
                <p className="text-muted-foreground">Hangi linklerinizin en çok tıklandığını görün ve kitlenizi daha iyi anlayın.</p>
              </Card>
              <Card className="p-8 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Share2 className="h-10 w-10 mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-xl font-semibold mb-2">Kolay Paylaşım</h3>
                <p className="text-muted-foreground">Benzersiz linkinizi sosyal medya biyografilerinizde, e-postalarınızda ve her yerde paylaşın.</p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <MadeWithDyad />
    </div>
  );
};

export default LandingPage;