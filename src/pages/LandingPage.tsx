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
  Shield,
  ChevronRight,
  Star,
  Globe,
  Smartphone,
  Code
} from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    title: "Kişiselleştirme",
    description: "Benzersiz profilinizi oluşturun. Renkler, yazı tipleri, arka planlar ve daha fazlasıyla kendinizi ifade edin.",
    icon: Palette,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Analiz ve İstatistikler",
    description: "Linklerinizin performansını izleyin. Hangi içeriğinizin popüler olduğunu görün.",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Kolay Paylaşım",
    description: "Tek bir bağlantı ile tüm dijital varlıklarınızı paylaşın. Sosyal medya biyografinizde, e-postalarınızda ve her yerde kullanın.",
    icon: Share2,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Tema ve Düzenler",
    description: "Profesyonel görünümlü temalar ve esnek yerleşim düzenleri arasından seçim yapın.",
    icon: LayoutGrid,
    color: "from-amber-500 to-orange-500"
  },
  {
    title: "Yüksek Performans",
    description: "Hızlı yüklenen ve tüm cihazlarda sorunsuz çalışan modern bir altyapı.",
    icon: Zap,
    color: "from-red-500 to-rose-500"
  },
  {
    title: "Güvenli ve Güvenilir",
    description: "Verilerinizin güvenliği bizim için en önemli önceliktir.",
    icon: Shield,
    color: "from-indigo-500 to-purple-500"
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
    rating: 5
  },
  {
    name: "Elif Kaya",
    role: "Youtuber",
    content: "Profil sayfam artık çok daha profesyonel görünüyor. Takipçi kazanmamda büyük etkisi oldu.",
    avatar: "EK",
    rating: 5
  },
  {
    name: "Mehmet Demir",
    role: "Startup Kurucusu",
    content: "Tüm iş bağlantılarımı tek bir bağlantıda toplamak o kadar kolay ki! Linkkoy'u kesinlikle tavsiye ederim.",
    avatar: "MD",
    rating: 4
  },
  {
    name: "Zeynep Arslan",
    role: "Pazarlama Müdürü",
    content: "Markamız için harika bir çözüm oldu. Analiz raporları çok faydalı.",
    avatar: "ZA",
    rating: 5
  },
  {
    name: "Can Berk",
    role: "Yazılım Geliştirici",
    content: "Kullanımı çok kolay ve özelleştirme seçenekleri harika. Kesinlikle tavsiye ederim.",
    avatar: "CB",
    rating: 4
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
  {
    question: "Hangi tür bağlantılar ekleyebilirim?",
    answer: "Web siteleri, sosyal medya profilleri, e-posta adresleri, PDF dosyaları, müzik ve video bağlantıları gibi her türlü dijital içeriği paylaşabilirsiniz."
  },
];

const stats = [
  { value: "10K+", label: "Aktif Kullanıcı" },
  { value: "100K+", label: "Oluşturulan Sayfa" },
  { value: "5M+", label: "Tıklama" },
  { value: "24/7", label: "Destek" }
];

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <span className="inline-block font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Linkkoy
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              <a href="#features" className="transition-all hover:text-foreground/80 text-foreground/60 px-3 py-2 rounded-lg hover:bg-accent">Özellikler</a>
              <a href="#how-it-works" className="transition-all hover:text-foreground/80 text-foreground/60 px-3 py-2 rounded-lg hover:bg-accent">Nasıl Çalışır</a>
              <a href="#testimonials" className="transition-all hover:text-foreground/80 text-foreground/60 px-3 py-2 rounded-lg hover:bg-accent">Yorumlar</a>
              <a href="#faq" className="transition-all hover:text-foreground/80 text-foreground/60 px-3 py-2 rounded-lg hover:bg-accent">SSS</a>
              <Link to="/pricing" className="transition-all hover:text-foreground/80 text-foreground/60 px-3 py-2 rounded-lg hover:bg-accent">Fiyatlandırma</Link>
            </nav>
            <Separator orientation="vertical" className="mx-2 h-6 hidden md:block" />
            <Button asChild variant="ghost" size="sm" className="rounded-lg">
              <Link to="/login">Giriş Yap</Link>
            </Button>
            <Button asChild className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Link to="/signup">Kayıt Ol</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-1 rounded-full text-sm font-medium bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <Sparkles className="mr-2 h-3 w-3" />
                Yeni Özellikler!
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Dijital Varlıklarınızı Tek Bir Noktada Toplayın
              </h1>
              <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl mx-auto">
                Sosyal medya hesaplarınızı, portfolyonuzu ve önemli bağlantılarınızı tek bir şık ve özelleştirilebilir sayfada toplayın. Profesyonel görünümlü bağlantı sayfaları oluşturun.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-xl px-8 py-6 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                <Link to="/signup">
                  <Play className="mr-2 h-5 w-5" /> Ücretsiz Başla
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-8 py-6 text-lg font-semibold border-2 backdrop-blur-sm">
                <Link to="/dashboard">Demoyu Gör</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Güçlü Özellikler</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Profesyonel görünümlü bağlantı sayfaları oluşturmak için ihtiyacınız olan her şey.
              </p>
            </div>
          </div>
          <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="rounded-2xl border bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <CardHeader className="pb-4">
                    <div className={`p-3 w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Nasıl Çalışır?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Linkkoy ile dijital varlığınızı oluşturmak sadece üç adımda!
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-12 mt-16 md:grid-cols-3 max-w-5xl">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white dark:border-gray-800 bg-indigo-600 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Kullanıcılarımız Ne Diyor?</h2>
              <p className="max-w-[900px] text-indigo-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Binlerce kullanıcı, dijital varlıklarını yönetmek için Linkkoy'u tercih ediyor.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-3xl">
            <Card className="rounded-2xl border-0 bg-white/10 backdrop-blur-lg shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonials[currentTestimonial].name}`} />
                    <AvatarFallback className="text-lg font-bold">{testimonials[currentTestimonial].avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-bold">{testimonials[currentTestimonial].name}</p>
                    <p className="text-indigo-200">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
                <p className="text-lg mb-6">"{testimonials[currentTestimonial].content}"</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < testimonials[currentTestimonial].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-3 w-3 rounded-full ${index === currentTestimonial ? 'bg-white' : 'bg-white/50'}`}
                  aria-label={`Testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Sıkça Sorulan Sorular</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Aklınıza takılan soruların cevapları burada.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-6 px-4 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 px-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Hemen Başlayın</h2>
              <p className="mx-auto max-w-[600px] text-indigo-100 md:text-xl">
                Dijital varlıklarınızı yönetmeye bugün başlayın ve takipçilerinizle daha etkili bir şekilde bağlantı kurun.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <Button asChild variant="secondary" size="lg" className="rounded-xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link to="/signup">
                  <Play className="mr-2 h-5 w-5" /> Ücretsiz Hesap Oluştur
                </Link>
              </Button>
            </div>
            <p className="text-sm text-indigo-200">
              Ücretsiz hesapla başlayın, sınırsız bağlantı paylaşın.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 md:py-12 border-t bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="space-y-4 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                  <LinkIcon className="h-5 w-5 text-white" />
                </div>
                <span className="inline-block font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Linkkoy
                </span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Tüm dijital bağlantılarınızı tek bir yerde toplayın. Profesyonel görünümlü bağlantı sayfaları oluşturun.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ürün</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Özellikler</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fiyatlandırma</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Entegrasyonlar</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Yol Haritası</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Şirket</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kariyer</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Basın</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Destek</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Yardım Merkezi</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">İletişim</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gizlilik Politikası</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kullanım Şartları</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2023 Linkkoy. Tüm hakları saklıdır.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Website</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Smartphone className="h-5 w-5" />
                <span className="sr-only">Mobile App</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Code className="h-5 w-5" />
                <span className="sr-only">API</span>
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