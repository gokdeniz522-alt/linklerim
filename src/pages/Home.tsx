import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@supabase/supabase-js';
import { Eye, Loader2, PlusCircle, Save, Trash2, Upload, Camera, Palette, Layout as LayoutIcon, PanelLeft, ImageIcon, Youtube, RectangleHorizontal, RectangleVertical, PictureInPicture2, Lock, Crown } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFaviconUrl } from '@/utils/favicon';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface LinkType {
  id: number;
  title: string;
  url: string;
  created_at: string;
  click_count: number;
  favicon_url: string | null;
}

type Theme = 'default' | 'minimalist' | 'glass' | 'neon' | 'retro';
type Layout = 'default' | 'sidebar-left' | 'modern-cover';
type YouTubeVisibility = 'visible' | 'hidden';
type YouTubePosition = 'default' | 'background' | 'bottom-right';

const themes: { id: Theme; name: string; description: string; pro: boolean }[] = [
  { id: 'default', name: 'Varsayılan', description: 'Modern ve yuvarlak hatlı standart tema.', pro: false },
  { id: 'minimalist', name: 'Minimalist', description: 'Sade, gölgesiz ve keskin hatlı bir görünüm.', pro: false },
  { id: 'glass', name: 'Cam Efekti', description: 'Arka plan resmiyle en iyi çalışan, şeffaf ve modern bir tema.', pro: true },
  { id: 'neon', name: 'Neon', description: 'Karanlık modda parlayan, canlı renklere sahip fütüristik bir tema.', pro: true },
  { id: 'retro', name: 'Retro Terminal', description: 'Eski bilgisayar terminallerini andıran, nostaljik bir görünüm.', pro: true },
];

const layouts: { id: Layout; name: string; description: string; icon: React.ElementType; pro: boolean }[] = [
    { id: 'default', name: 'Varsayılan', description: 'Profil bilgileri sayfanın üst kısmında yer alır.', icon: LayoutIcon, pro: false },
    { id: 'sidebar-left', name: 'Kenar Çubuğu', description: 'Profil bilgileri solda, linkler sağda listelenir.', icon: PanelLeft, pro: true },
    { id: 'modern-cover', name: 'Modern Cover', description: 'Geniş kapak resmi ve alta konumlanmış avatar.', icon: ImageIcon, pro: true },
];

const youtubePositions: { id: YouTubePosition; name: string; description: string; icon: React.ElementType; pro: boolean }[] = [
    { id: 'default', name: 'Normal', description: 'Video, sayfa içeriğinin bir parçası olarak görünür.', icon: RectangleHorizontal, pro: false },
    { id: 'background', name: 'Arka Plan', description: 'Video, tüm sayfanın arka planını kaplar.', icon: RectangleVertical, pro: true },
    { id: 'bottom-right', name: 'Sağ Alt Köşe', description: 'Video, sağ altta sabitlenmiş küçük bir oynatıcıda görünür.', icon: PictureInPicture2, pro: true },
];

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
  const [selectedTheme, setSelectedTheme] = useState<Theme>('default');
  const [selectedLayout, setSelectedLayout] = useState<Layout>('default');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeVisibility, setYoutubeVisibility] = useState<YouTubeVisibility>('visible');
  const [youtubePosition, setYoutubePosition] = useState<YouTubePosition>('default');
  const [usernameColor, setUsernameColor] = useState('#000000');
  const [bioColor, setBioColor] = useState('#000000');
  const [linkTitleColor, setLinkTitleColor] = useState('#000000');
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'pro'>('free');

  const profileHeaderImageInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const [profileResponse, linksResponse] = await Promise.all([
          supabase.from('profiles').select('*, username_color, bio_color, link_title_color, subscription_plan').eq('id', user.id).single(),
          supabase.from('links').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        ]);

        if (profileResponse.error) {
          showError('Profil bilgileri yüklenemedi.');
        } else {
          const { data } = profileResponse;
          setUsername(data.username);
          setAvatarUrl(data.avatar_url);
          setBio(data.bio || '');
          setBackgroundType(data.background_type || 'none');
          if (data.background_type === 'color') {
            setBackgroundColor(data.background_value || '#ffffff');
          } else if (data.background_type === 'image') {
            setBackgroundImageUrl(data.background_value);
          }
          setProfileHeaderImageUrl(data.profile_header_image_url);
          setSelectedTheme(data.theme || 'default');
          setSelectedLayout(data.layout || 'default');
          setYoutubeUrl(data.youtube_url || '');
          setYoutubeVisibility(data.youtube_visibility || 'visible');
          setYoutubePosition(data.youtube_position || 'default');
          setUsernameColor(data.username_color || '#000000');
          setBioColor(data.bio_color || '#000000');
          setLinkTitleColor(data.link_title_color || '#000000');
          setSubscriptionPlan(data.subscription_plan || 'free');
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
      handleProfileHeaderImageUpload(event.target.files[0]);
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
      return result.data.url;
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

  const handleProfileHeaderImageUpload = async (fileToUpload: File | null = profileHeaderImageFile) => {
    if (!fileToUpload || !user) return;

    setIsUploadingProfileHeader(true);
    try {
      const newProfileHeaderImageUrl = await uploadImageToImgBB(fileToUpload);
      setProfileHeaderImageUrl(newProfileHeaderImageUrl);
      showSuccess('Profil başlık resmi başarıyla yüklendi! Kaydetmeyi unutmayın.');
    } catch (error: any) {
      showError(error.message || 'Profil başlık resmi yüklenemedi.');
    } finally {
      setIsUploadingProfileHeader(false);
    }
  };

  const handleRemoveProfileHeaderImage = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ profile_header_image_url: null })
        .eq('id', user.id);

      if (error) throw new Error(error.message);

      setProfileHeaderImageUrl(null);
      showSuccess('Profil başlık resmi başarıyla kaldırıldı!');
    } catch (error: any) {
      showError(error.message || 'Profil başlık resmi kaldırılamadı.');
    } finally {
      setIsSavingProfile(false);
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
        profile_header_image_url: profileHeaderImageUrl,
        theme: selectedTheme,
        layout: selectedLayout,
        youtube_url: youtubeUrl,
        youtube_visibility: youtubeVisibility,
        youtube_position: youtubePosition,
        username_color: usernameColor,
        bio_color: bioColor,
        link_title_color: linkTitleColor,
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

    // Ücretsiz plan kullanıcıları için link sınırı kontrolü
    if (subscriptionPlan === 'free' && links.length >= 5) {
      showError('Ücretsiz planda en fazla 5 link ekleyebilirsiniz. Daha fazlası için Pro planına yükseltin.');
      return;
    }

    setIsSubmitting(true);
    const favicon_url = getFaviconUrl(newLinkUrl);
    const { data, error } = await supabase
      .from('links')
      .insert([{ title: newLinkTitle, url: newLinkUrl, user_id: user.id, favicon_url: favicon_url }])
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

  // Pro özellik kontrol fonksiyonu
  const isProFeature = (featurePro: boolean) => {
    return featurePro && subscriptionPlan !== 'pro';
  };

  // Pro özellik için tooltip içeriği
  const ProFeatureTooltip = ({ children, featurePro }: { children: React.ReactNode; featurePro: boolean }) => {
    if (!isProFeature(featurePro)) {
      return <>{children}</>;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              {children}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bu özellik yalnızca Pro plan kullanıcıları içindir. Yükseltmek için tıklayın.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
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
      
      {subscriptionPlan === 'free' && (
        <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Pro Plan'a Yükselt
                </h3>
                <p className="mt-1">Sınırsız bağlantı, premium temalar ve daha fazlası için Pro plan'a geçin!</p>
              </div>
              <Button asChild variant="secondary">
                <Link to="/pricing">Yükselt</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <main className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profil Ayarları</CardTitle>
            <CardDescription>Profil resminizi, başlık görselinizi ve açıklamanızı güncelleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="relative w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
              style={profileHeaderImageUrl ? { backgroundImage: `url(${profileHeaderImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              onClick={() => profileHeaderImageInputRef.current?.click()}
            >
              <input 
                id="profile-header-image" 
                type="file" 
                accept="image/*" 
                onChange={handleProfileHeaderImageFileChange} 
                className="hidden"
                ref={profileHeaderImageInputRef}
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-4">
                <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800">
                  <AvatarImage src={avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${username}`} alt={username || ''} />
                  <AvatarFallback>{username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-white text-shadow-sm">
                  <h3 className="text-xl font-bold">{username}</h3>
                  <p className="text-sm">{bio || 'Biyografi yok.'}</p>
                </div>
              </div>
              {profileHeaderImageUrl && (
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleRemoveProfileHeaderImage(); }} 
                  disabled={isSavingProfile} 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-4 right-4"
                >
                  {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Kaldır
                </Button>
              )}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Profil Resmi</Label>
              <Input id="picture" type="file" accept="image/*" onChange={handleAvatarFileChange} />
              <Button onClick={handleAvatarUpload} disabled={!selectedFile || isUploading} size="sm" className="mt-2">
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Yükle
              </Button>
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
            <CardTitle>Yerleşim Düzeni</CardTitle>
            <CardDescription>Profil sayfanızın genel yapısını seçin.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {layouts.map((layout) => {
              const Icon = layout.icon;
              const isLocked = isProFeature(layout.pro);
              
              return (
                <ProFeatureTooltip key={layout.id} featurePro={layout.pro}>
                  <div
                    className={cn(
                      'p-4 border rounded-lg cursor-pointer transition-all flex flex-col items-center text-center relative',
                      selectedLayout === layout.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50',
                      isLocked && 'opacity-70 cursor-not-allowed'
                    )}
                    onClick={() => {
                      if (isLocked) {
                        navigate('/pricing');
                        return;
                      }
                      setSelectedLayout(layout.id);
                    }}
                  >
                    <Icon className="h-8 w-8 mb-2" />
                    <h3 className="font-semibold">{layout.name}</h3>
                    <p className="text-sm text-muted-foreground">{layout.description}</p>
                    {&& (
                      <Badge className="absolute top-2 right-2" variant="secondary">Pro</Badge>
                    )}
                  </div>
                </ProFeatureTooltip>
              );
            })}
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateProfile} disabled={isSavingProfile}>
              {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Yerleşimi Kaydet
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasarım Ayarları</CardTitle>
            <CardDescription>Herkese açık profil sayfanızın görünümünü seçin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const isLocked = isProFeature(theme.pro);
                
                return (
                  <ProFeatureTooltip key={theme.id} featurePro={theme.pro}>
                    <div
                      className={cn(
                        'p-4 border rounded-lg cursor-pointer transition-all relative',
                        selectedTheme === theme.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50',
                        isLocked && 'opacity-70 cursor-not-allowed'
                      )}
                      onClick={() => {
                        if (isLocked) {
                          navigate('/pricing');
                          return;
                        }
                        setSelectedTheme(theme.id);
                      }}
                    >
                      <h3 className="font-semibold">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                      {theme.pro && (
                        <Badge className="absolute top-2 right-2" variant="secondary">Pro</Badge>
                      )}
                    </div>
                  </ProFeatureTooltip>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateProfile} disabled={isSavingProfile}>
              {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Tasarımı Kaydet
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yazı Rengi Ayarları</CardTitle>
            <CardDescription>Profil sayfanızdaki metinlerin renklerini özelleştirin.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username-color">Kullanıcı Adı Rengi</Label>
              <Input id="username-color" type="color" value={usernameColor} onChange={(e) => setUsernameColor(e.target.value)} className="w-full h-10 p-1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio-color">Biyografi Rengi</Label>
              <Input id="bio-color" type="color" value={bioColor} onChange={(e) => setBioColor(e.target.value)} className="w-full h-10 p-1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-title-color">Link Başlığı Rengi</Label>
              <Input id="link-title-color" type="color" value={linkTitleColor} onChange={(e) => setLinkTitleColor(e.target.value)} className="w-full h-10 p-1" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateProfile} disabled={isSavingProfile}>
              {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Renkleri Kaydet
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
            <CardTitle>YouTube Video</CardTitle>
            <CardDescription>Profilinize arka planda çalacak bir YouTube videosu veya müziği ekleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube Video URL</Label>
              <Input id="youtube-url" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube-visibility">Görünürlük</Label>
              <Select value={youtubeVisibility} onValueChange={(value: YouTubeVisibility) => setYoutubeVisibility(value)}>
                <SelectTrigger id="youtube-visibility">
                  <SelectValue placeholder="Görünürlük seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visible">Görünür Video</SelectItem>
                  <SelectItem value="hidden">Gizli (Sadece Ses)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {youtubeVisibility === 'visible' && (
              <div className="space-y-4 pt-4 border-t">
                <Label>Video Pozisyonu</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {youtubePositions.map((position) => {
                        const Icon = position.icon;
                        const isLocked = isProFeature(position.pro);
                        
                        return (
                          <ProFeatureTooltip key={position.id} featurePro={position.pro}>
                            <div
                              className={cn(
                                'p-4 border rounded-lg cursor-pointer transition-all flex flex-col items-center text-center relative',
                                youtubePosition === position.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50',
                                isLocked && 'opacity-70 cursor-not-allowed'
                              )}
                              onClick={() => {
                                if (isLocked) {
                                  navigate('/pricing');
                                  return;
                                }
                                setYoutubePosition(position.id);
                              }}
                            >
                              <Icon className="h-8 w-8 mb-2" />
                              <h3 className="font-semibold">{position.name}</h3>
                              <p className="text-sm text-muted-foreground">{position.description}</p>
                              {position.pro && (
                                <Badge className="absolute top-2 right-2" variant="secondary">Pro</Badge>
                              )}
                            </div>
                          </ProFeatureTooltip>
                        );
                    })}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateProfile} disabled={isSavingProfile}>
              {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Kaydet
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
              {subscriptionPlan === 'free' && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{links.length}/5</span> ücretsiz link limitiniz kaldı.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting || (subscriptionPlan === 'free' && links.length >= 5)}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                Ekle
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Linklerin</h2>
            {subscriptionPlan === 'free' && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{links.length}/5</span> link
              </div>
            )}
          </div>
          <div className="space-y-4">
            {links.length > 0 ? (
              links.map(link => (
                <Card key={link.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {link.favicon_url && (
                        <img src={link.favicon_url} alt="Favicon" className="w-5 h-5 rounded-full" />
                      )}
                      <div>
                        <p className="font-semibold">{link.title}</p>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">
                          {link.url}
                        </a>
                      </div>
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