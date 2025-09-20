import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError } from '@/utils/toast';
import { ThemeToggle } from '@/components/theme-toggle';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'goko' && password === '123') {
      // Not: Gerçek bir uygulamada şifreler asla bu şekilde kontrol edilmemelidir.
      // Bu sadece basit bir demo içindir.
      sessionStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      showError('Kullanıcı adı veya şifre yanlış.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
       <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Girişi</CardTitle>
          <CardDescription>Lütfen devam etmek için giriş yapın.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                type="text"
                placeholder="goko"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Giriş Yap</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;