import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  BarChart3, 
  Share2, 
  Sparkles, 
  Rocket, 
  LayoutGrid, 
  Link as LinkIcon,
  Play,
  CheckCircle,
  Users,
  Zap,
  Shield
} from 'lucide-react';

const features = [
  {
    title: "Kişiselleştirme",
    description: "Benzersiz profilinizi oluşturun. Renkler, yazı tipleri, arka planlar ve daha fazlasıyla kendinizi ifade edin.",
    icon: Palette,
  },
  {
    title: "Analiz ve İstatistikler",
    description: "Linklerinizin performansını izleyin. Hangi içeriğinizin popüler olduğunu görün.",
    icon: BarChart3,
  },
  {
    title: "Kolay Paylaşım",
    description: "Tek bir bağlantı ile tüm dijital varlıklarınızı paylaşın. Sosyal medya biyografinizde, e-postalarınızda ve her yerde kullanın.",
    icon: Share2,
  },
  {
    title: "Tema ve Düzenler",
    description: "Profesyonel görünümlü temalar ve esnek yerleşim düzenleri arasından seçim yapın.",
    icon: LayoutGrid,
  },
  {
    title: "Yüksek Performans",
    description: "Hızlı yüklenen ve tüm cihazlarda sorunsuz çalışan modern bir altyapı.",
    icon: Zap,
  },
  {
    title: "Güvenli ve Güvenilir",
    description: "Verilerinizin güvenliği bizim için en önemli önceliktir.",
    icon: Shield,
  },
];

const steps = [
  {
    title: "Hesap Oluştur",
    description: "Hızlı ve ücretsiz bir şekilde kaydolun. Sadece birkaç saniyenizi alır.",
    icon: Rocket,
  },
  {
    title: "Sayfanı Tasarla",
    description: "Linklerinizi ekleyin, profilinizi özelleştirin, temalar ve arka planlarla kişiselleştirin.",
    icon: Palette,
  },
  {
    title: "Paylaşmaya Başla",
    description: "Benzersiz Linkkoy URL'nizi tüm platformlarda paylaşın ve takipçilerinizle buluşun.",
    icon: Share2,
  },
];

const testimonials = [
  {
    name: "Ahmet Yılmaz",
    role: "Freelance Tasarımcı",
    content: "Linkkoy sayesinde tüm sosyal medya hesaplarımı ve portfolyomu tek bir yerde topladım. Müşterilerim ulaşımı çok kolaylaştı!",
    avatar: "AY",
  },
  {
    name: "Elif Kaya",
    role: "Youtuber",
    content: "Profil sayfam artık çok daha profesyonel görünüyor. Takipçi kazanmamda büyük etkisi oldu.",
    avatar: "EK",
  },
  {
    name: "Mehmet Demir",
    role: "Startup Kurucusu",
    content: "Tüm iş bağlantılarımı tek bir bağlantıda toplamak o kadar kolay ki! Linkkoy'u kesinlikle tavsiye ederim.",
    avatar: "MD",
  },
];

const faqs = [
  {
    question: "Linkkoy nedir?",
    answer: "Linkkoy, tüm dijital bağlantılarınızı tek bir şık ve özelleştirilebilir sayfada toplamanızı sağlayan bir bağlantı yönetimi platformudur."
  },
  {
    question: "Linkkoy'u kullanmak ücretli midir?",
    answer: "Temel özelliklerimizi ücretsiz olarak kullanabilirsiniz. Daha gelişmiş özellikler için uygun fiyatlı premium planlarımız mevcuttur."
  },
  {
    question: "Kendi alan adımı kullanabilir miyim?",
    answer: "Evet, premium planlarımızla kendi alan adınızı (örnek.com) profil sayfanız olarak kullanabilirsiniz."
  },
  {
    question: "Verilerim güvende mi?",
    answer: "Evet, kullanıcı verilerinin güvenliği bizim için en önemli önceliktir. Tüm verileriniz şifrelenir ve güvenli sunucularda saklanır."
  },
];

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <span className="inline-block font-bold text-xl">Linkkoy</span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">Özellikler</a>
              <a href="#how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">Nasıl Çalışır</a>
              <a href="#testimonials" className="transition-colors hover:text-foreground/80 text-foreground/60">Yorumlar</a>
              <a href="#faq" className="transition-colors hover:text-foreground/80 text-foreground/60">SSS</a>
            </nav>
            <Separator orientation="vertical" className="mx-2 h-6 hidden md:block" />
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Giriş Yap</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Kayıt Ol</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.15)_0%,rgba(0,0,0,0)_70%)]"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(99,102,241,0.1)_0deg,rgba(168,85,247,0.1)_120deg,rgba(236,72,153,0.1)_240deg,rgba(99,102,241,0.1)_360deg)]"></div>
        </div>
        
        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="secondary" className="px-4 py-1 rounded-full text-sm font-medium">
                <Sparkles className="mr-2 h-3 w-3" />
                Yeni Özellikler!
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Tüm Dijital Varlıklarınızı Tek Bir Yerde Toplayın
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                Sosyal medya hesaplarınızı, portfolyonuzu ve önemli bağlantılarınızı tek bir şık ve özelleştirilebilir sayfada toplayın.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link to="/signup">
                  <Play className="mr-2 h-4 w-4" /> Ücretsiz Başla
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">Giriş yap</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Güçlü Özellikler</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Profesyonel görünümlü bağlantı sayfaları oluşturmak için ihtiyacınız olan her şey.
              </p>
            </div>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="p-2 w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nasıl Çalışır?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Linkkoy ile dijital varlığınızı oluşturmak sadece üç adımda!
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-8 mt-12 md:grid-cols-3 max-w-5xl">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-6">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="relative pb-8">
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-muted-foreground/20"></div>
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600 bg-background text-indigo-600 font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Kullanıcılarımız Ne Diyor?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Binlerce kullanıcı, dijital varlıklarını yönetmek için Linkkoy'u tercih ediyor.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-6 mt-12 md:grid-cols-3 max-w-5xl">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`} />
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sıkça Sorulan Sorular</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Aklınıza takılan soruların cevapları burada.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-indigo-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Hemen Başlayın</h2>
              <p className="mx-auto max-w-[600px] text-indigo-100 md:text-xl">
                Dijital varlıklarınızı yönetmeye bugün başlayın ve takipçilerinizle daha etkili bir şekilde bağlantı kurun.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild variant="secondary" size="lg">
                <Link to="/signup">
                  <Play className="mr-2 h-4 w-4" /> Ücretsiz Hesap Oluştur
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-indigo-600">
                <Link to="/dashboard">Demoyu Gör</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-8 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <LinkIcon className="h-5 w-5 text-white" />
                </div>
                <span className="inline-block font-bold text-xl">Linkkoy</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Tüm dijital bağlantılarınızı tek bir yerde toplayın.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Ürün</h3>
              <ul className="space-y-1">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Özellikler</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Fiyatlandırma</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Entegrasyonlar</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Şirket</h3>
              <ul className="space-y-1">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Hakkımızda</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Kariyer</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Destek</h3>
              <ul className="space-y-1">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Yardım Merkezi</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">İletişim</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Gizlilik Politikası</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2023 Linkkoy. Tüm hakları saklıdır.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                {/* Twitter icon would go here */}
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                {/* GitHub icon would go here */}
              </a>
            </div>
          </div>
        </div>
      </footer>

      <MadeWithDyad />
    </div>
  );
};

export default LandingPage;