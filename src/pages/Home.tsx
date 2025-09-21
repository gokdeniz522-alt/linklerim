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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [backgroundType, setBackgroundType] = useState<'none' | 'color' | 'image'>('none');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const [profileHeaderImageFile, setProfileHeaderImageFile] = useState<File | null>(null);
  const [profileHeaderImageUrl, setProfileHeaderImageUrl] = useState<string | null>(null);
  const [isUploadingProfileHeader, setIsUploadingProfileHeader] = useState(false);


  const navigate = useNavigate();

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const [profileResponse, linksResponse] = await Promise.all([
          supabase.from('profiles').select('username, avatar_url, bio, background_type, background_value, profile_header_image_url').eq('id', user.id).single(),
          supabase.from('links').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        ]);

        if (profileResponse.error) {
          showError('Profil bilgileri yüklenemedi.');
        } else {
          setUsername(profileResponse.data.username);
          setAvatarUrl(profileResponse.data.avatar_url);
          setBio(profileResponse.data.bio || '');
          setBackgroundType(profileResponse.data.background_type || 'none');
          if (profileResponse.data.background_type === 'color') {
            setBackgroundColor(profileResponse.data.background_value || '#ffffff');
          } else if (profileResponse.data.background_type === 'image') {
            setBackgroundImageUrl(profileResponse.data.background_value);
          }
          setProfileHeaderImageUrl(profileResponse.data.profile_header_image_url);
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

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleBackgroundImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setBackgroundImageFile(event.target.files[0]);
    }
  };

  const handleProfileHeaderImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfileHeaderImageFile(event.target.files[0]);
    }
  };

  const uploadImageToImgBB = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      return result.data.display_url;
    } else {
      throw new Error(result.error.message || 'Resim yüklenemedi.');
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      const newAvatarUrl = await uploadImageToImgBB(selectedFile);
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user.id);

      if (error) throw new Error(error.message);

      setAvatarUrl(newAvatarUrl);
      setSelectedFile(null);
      showSuccess('Profil resmi başarıyla güncellendi!');
    } catch (error: any) {
      showError(error.message || 'Bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackgroundImageUpload = async () => {
    if (!backgroundImageFile || !user) return;

    setIsUploadingBackground(true);
    try {
      const newBackgroundImageUrl = await uploadImageToImgBB(backgroundImageFile);
      setBackgroundImageUrl(newBackgroundImageUrl);
      showSuccess('Arka plan resmi başarıyla yüklendi! Kaydetmeyi unutmayın.');
    } catch (error: any) {
      showError(error.message || 'Arka plan resmi yüklenemedi.');
    } finally {
      setIsUploadingBackground(false);
    }
  };

  const handleProfileHeaderImageUpload = async () => {
    if (!profileHeaderImageFile || !user) return;

    setIsUploadingProfileHeader(true);
    try {
      const newProfileHeaderImageUrl = await uploadImageToImgBB(profileHeaderImageFile);
      setProfileHeaderImageUrl(newProfileHeaderImageUrl);
      showSuccess('Profil başlık resmi başarıyla yüklendi! Kaydetmeyi unutmayın.');
    } catch (error: any) {
      showError(error.message || 'Profil başlık resmi yüklenemedi.');
    } finally {
      setIsUploadingProfileHeader(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);

    let backgroundValueToSave = null;
    if (backgroundType === 'color') {
      backgroundValueToSave = backgroundColor;
    } else if (backgroundType === 'image') {
      backgroundValueToSave = backgroundImageUrl;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ 
        bio: bio,
        background_type: backgroundType,
        background_value: backgroundValueToSave,
        profile_header_image_url: profileHeaderImageUrl
      })
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
                <Input id="picture" type="file" accept="image/*" onChange={handleAvatarFileChange} />
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
            <CardTitle>Arka Plan Ayarları</CardTitle>
            <CardDescription>Herkese açık profil sayfanızın arka planını özelleştirin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="background-type">Arka Plan Türü</Label>
              <Select value={backgroundType} onValueChange={(value: 'none' | 'color' | 'image') => setBackgroundType(value)}>
                <SelectTrigger id="background-type">
                  <SelectValue placeholder="Arka plan türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Yok</SelectItem>
                  <SelectItem value="color">Renk</SelectItem>
                  <SelectItem value="image">Resim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {backgroundType === 'color' && (
              <div className="space-y-2">
                <Label htmlFor="background-color">Arka Plan Rengi</Label>
                <Input 
                  id="background-color" 
                  type="color" 
                  value={backgroundColor} 
                  onChange={(e) => setBackgroundColor(e.target.value)} 
                  className="w-full h-10 p-1"
                />
              </div>
            )}

            {backgroundType === 'image' && (
              <div className="space-y-2">
                <Label htmlFor="background-image">Arka Plan Resmi</Label>
                <Input id="background-image" type="file" accept="image/*" onChange={handleBackgroundImageFileChange} />
                <Button onClick={handleBackgroundImageUpload} disabled={!backgroundImageFile || isUploadingBackground} size="sm" className="mt-2">
                  {isUploadingBackground ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Resmi Yükle
                </Button>
                {backgroundImageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Mevcut Arka Plan Resmi:</p>
                    <img src={backgroundImageUrl} alt="Arka Plan Önizlemesi" className="w-32 h-32 object-cover rounded-md mt-1" />
                  </div>
                )}
              </div>
            )}
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
            <CardTitle>Profil Başlık Resmi</CardTitle>
            <CardDescription>Profil resminizin arkasında görünecek bir görsel yükleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-header-image">Başlık Resmi</Label>
              <Input id="profile-header-image" type="file" accept="image/*" onChange={handleProfileHeaderImageFileChange} />
              <Button onClick={handleProfileHeaderImageUpload} disabled={!profileHeaderImageFile || isUploadingProfileHeader} size="sm" className="mt-2">
                {isUploadingProfileHeader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Resmi Yükle
              </Button>
              {profileHeaderImageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Mevcut Başlık Resmi:</p>
                  <img src={profileHeaderImageUrl} alt="Başlık Resmi Önizlemesi" className="w-full h-32 object-cover rounded-md mt-1" />
                </div>
              )}
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