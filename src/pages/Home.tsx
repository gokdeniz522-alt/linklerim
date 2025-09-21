import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@supabase/supabase-js';
import { Eye, Loader2, PlusCircle, Save, Trash2, Upload } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Textarea } from '@/components/ui/textarea';

interface LinkType {
  id: number;
  title: string;
  url: string;
  created_at: string;
  click_count: number;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<LinkType[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const navigate = useNavigate();

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const [profileResponse, linksResponse] = await Promise.all([
          supabase.from('profiles').select('username, avatar_url, bio').eq('id', user.id).single(),
          supabase.from('links').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        ]);

        if (profileResponse.error) {
          showError('Profil bilgileri yüklenemedi.');
        } else {
          setUsername(profileResponse.data.username);
          setAvatarUrl(profileResponse.data.avatar_url);
          setBio(profileResponse.data.bio || '');
        }

        if (linksResponse.error) {
          showError('Linkler yüklenirken bir hata oluştu.');
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const newAvatarUrl = result.data.display_url;
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: newAvatarUrl })
          .eq('id', user.id);

        if (error) throw new Error(error.message);

        setAvatarUrl(newAvatarUrl);
        setSelectedFile(null);
        showSuccess('Profil resmi başarıyla güncellendi!');
      } else {
        throw new Error(result.error.message || 'Resim yüklenemedi.');
      }
    } catch (error: any) {
      showError(error.message || 'Bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    const { error } = await supabase
      .from('profiles')
      .update({ bio: bio })
      .eq('id', user.id);

    if (error) {
      showError('Profil güncellenirken bir hata oluştu.');
    } else {
      showSuccess('Profil başarıyla güncellendi!');
    }
    setIsSavingProfile(false);
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
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={handleLogout} variant="outline">Çıkış Yap</Button>
        </div>
      </header>
      {username && (
        <div className="mb-8 text-sm text-muted-foreground">
          Herkese açık profil sayfan: <Link to={`/${username}`} className="underline hover:text-primary">{window.location.origin}/{username}</Link>
        </div>
      )}
      
      <main className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profil Ayarları</CardTitle>
            <CardDescription>Profil resminizi ve açıklamanızı güncelleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${username}`} alt={username || ''} />
                <AvatarFallback>{username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Profil Resmi</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
                <Button onClick={handleAvatarUpload} disabled={!selectedFile || isUploading} size="sm" className="mt-2">
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Yükle
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Profil Açıklaması (Bio)</Label>
              <Textarea id="bio" placeholder="Kendinizden bahsedin..." value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateProfile} disabled={isSavingProfile}>
              {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Değişiklikleri Kaydet
            </Button>
          </CardFooter>
        </Card>

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
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{link.click_count}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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