import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MadeWithDyad } from '@/components/made-with-dyad';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto py-4 px-4 flex justify-end relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Tüm Linklerin Tek Bir Yerde
          </h1>
          <p className="text-lg text-muted-foreground">
            Sosyal medya profillerinizden kişisel web sitelerinize kadar tüm önemli linklerinizi tek, şık bir sayfada toplayın ve kolayca paylaşın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button asChild size="lg">
              <Link to="/signup">Hemen Kaydol</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Giriş Yap</Link>
            </Button>
          </div>
        </div>
      </main>

      <MadeWithDyad />
    </div>
  );
};

export default LandingPage;