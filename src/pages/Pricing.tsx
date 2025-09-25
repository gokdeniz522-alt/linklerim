import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Sparkles, Crown } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { showError } from '@/utils/toast';
import EcwidProductWidget from '@/components/EcwidProductWidget'; // Yeni eklenen import

const plans = [
  {
    name: "Ücretsiz",
    price: "0₺",
    period: "aylık",
    description: "Temel özelliklerle başlayın",
    features: [
      "5 bağlantı",
      "Temel temalar",
      "Özel arka plan",
      "İstatistikler",
      "Kendi alan adınız (ücretli)",
    ],
    notFeatures: [
      "Sınırsız bağlantı",
      "Premium temalar",
      "YouTube entegrasyonu",
      "Öncelikli destek",
    ],
    cta: "Ücretsiz Başla",
    popular: false,
  },
  {
    name: "Pro",
    price: "9.99₺",
    period: "aylık",
    description: "Gelişmiş özellikler için",
    features: [
      "Sınırsız bağlantı",
      "Tüm temalar",
      "YouTube entegrasyonu",
      "Özel arka plan",
      "İstatistikler",
      "Kendi alan adınız",
      "Öncelikli destek",
    ],
    notFeatures: [],
    cta: "Ücretsiz Dene",
    popular: true,
  },
];

const faqs = [
  {
    question: "Ücretsiz deneme süresi var mı?",
    answer: "Evet, Pro plan için 14 gün ücretsiz deneme süremiz bulunmaktadır. Deneme süresi boyunca tüm Pro özelliklerinden sınırsız şekilde yararlanabilirsiniz."
  },
  {
    question: "Faturalandırma nasıl yapılır?",
    answer: "Faturalandırma aylık olarak yapılır. Aboneliğinizi istediğiniz zaman iptal edebilirsiniz."
  },
  {
    question: "İptal etmek istesem ne olur?",
    answer: "Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrasında Pro özelliklerine erişiminiz sonlandırılacaktır."
  },
  {
    question: "Ödemeleri nasıl kabul ediyorsunuz?",
    answer: "Kredi kartı ve banka havalesi ile ödeme yapabilirsiniz."
  },
];

export default function Pricing() {
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'pro'>('free');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setSubscriptionPlan(data.subscription_plan || 'free');
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  // handleCheckout fonksiyonu artık doğrudan kullanılmayacak, Ecwid widget'ı kendi ödeme akışını yönetecek.
  // Ancak, kullanıcı giriş yapmamışsa Ecwid widget'ını göstermeden önce giriş yapmaya yönlendirmek için
  // bir kontrol ekleyebiliriz. Şimdilik, widget'ı doğrudan render edeceğiz ve Ecwid'in kendi akışını kullanacağız.

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="inline-block font-bold text-xl">Linkkoy</span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Anasayfa</Link>
              <a href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Fiyatlandırma</a>
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

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="secondary" className="px-4 py-1 rounded-full text-sm font-medium">
                <Sparkles className="mr-2 h-3 w-3" />
                Üyelik Planları
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Basit, şeffaf fiyatlandırma</h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                İhtiyacınıza uygun planı seçin. Her zaman olduğu gibi, ilk 14 gün ücretsiz.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 mt-12">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`rounded-2xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg ${
                  plan.popular ? 'border-indigo-500 relative' : ''
                } ${
                  (plan.name === "Ücretsiz" && subscriptionPlan === 'free') || 
                  (plan.name === "Pro" && subscriptionPlan === 'pro') 
                    ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    EN POPÜLER
                  </div>
                )}
                {(plan.name === "Ücretsiz" && subscriptionPlan === 'free') || 
                 (plan.name === "Pro" && subscriptionPlan === 'pro') ? (
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Mevcut Planınız
                    </Badge>
                  </div>
                ) : null}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.notFeatures.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-muted-foreground">
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.name === "Ücretsiz" ? (
                    subscriptionPlan === 'free' ? (
                      <Button className="w-full" disabled>
                        Mevcut Planınız
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to="/dashboard">Planı Seç</Link>
                      </Button>
                    )
                  ) : ( // Bu kısım Pro plan için
                    subscriptionPlan === 'pro' ? (
                      <Button className="w-full" disabled>
                        Mevcut Planınız
                      </Button>
                    ) : (
                      // Ecwid widget'ını burada render et
                      <EcwidProductWidget />
                    )
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sıkça Sorulan Sorular</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Fiyatlandırma ile ilgili sorularınızın cevapları burada.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg p-6 bg-background">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-indigo-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Hazır mısınız?</h2>
              <p className="mx-auto max-w-[600px] text-indigo-100 md:text-xl">
                Bugün ücretsiz hesap oluşturun ve Linkkoy'un sunduğu tüm avantajlardan yararlanmaya başlayın.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild variant="secondary" size="lg">
                <Link to="/signup">Ücretsiz Başla</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-indigo-600">
                <Link to="/contact">İletişim</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-8 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2023 Linkkoy. Tüm hakları saklıdır.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}