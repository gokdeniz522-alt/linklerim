import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@supabase/supabase-js';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface LinkType {
  id: number;
  title: string;
  url: string;
  created_at: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Fetch profile and links in parallel
        const [profileResponse, linksResponse] = await Promise.all([
          supabase.from('profiles').select('username').eq('id', user.id).single(),
          supabase.from('links').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        ]);

        if (profileResponse.error) {
          showError('Profil bilgileri yüklenemedi.');
          console.error(profileResponse.error);
        } else {
          setUsername(profileResponse.data.username);
        }

        if (linksResponse.error) {
          showError('Linkler yüklenirken bir hata oluştu.');
          console.error(linksResponse.error);
        } else {
          setLinks(linksResponse.data);
        }

      } else {
        navigate('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) {
      showError('Lütfen başlık ve URL alanlarını doldurun.');
      return;
    }
    if (!user) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('links')
      .insert([{ title: newLinkTitle, url: newLinkUrl, user_id: user.id }])
      .select()
      .single();

    if (error) {
      showError('Link eklenirken bir hata oluştu.');
      console.error(error);
    } else if (data) {
      setLinks([data, ...links]);
      setNewLinkTitle('');
      setNewLinkUrl('');
      showSuccess('Link başarıyla eklendi!');
    }
    setIsSubmitting(false);
  };

  const handleDeleteLink = async (linkId: number) => {
    const { error } = await supabase.from('links').delete().eq('id', linkId);
    if (error) {
      showError('Link silinirken bir hata oluştu.');
      console.error(error);
    } else {
      setLinks(links.filter(link => link.id !== linkId));
      showSuccess('Link başarıyla silindi.');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Yönetim Paneli</h1>
        <Button onClick={handleLogout} variant="outline">Çıkış Yap</Button>
      </header>
      {username && (
        <div className="mb-8 text-sm text-muted-foreground">
          Herkese açık profil sayfan: <Link to={`/${username}`} className="underline hover:text-primary">{window.location.origin}/{username}</Link>
        </div>
      )}
      
      <main className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Yeni Link Ekle</CardTitle>
            <CardDescription>Paylaşmak istediğiniz linkin bilgilerini girin.</CardDescription>
          </CardHeader>
          <form onSubmit={handleAddLink}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık</Label>
                <Input id="title" placeholder="Örn: Twitter Hesabım" value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" type="url" placeholder="https://twitter.com/kullaniciadi" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                Ekle
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div>
          <h2 className="text-xl font-bold mb-4">Linklerin</h2>
          <div className="space-y-4">
            {links.length > 0 ? (
              links.map(link => (
                <Card key={link.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{link.title}</p>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">
                        {link.url}
                      </a>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">Henüz hiç link eklemedin.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;