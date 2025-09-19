import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export interface Post {
  id: number;
  created_at: string;
  username: string;
  content: string;
  image_url: string | null;
}

interface PostItemProps {
  post: Post;
}

export const PostItem = ({ post }: PostItemProps) => {
  return (
    <Card className="w-full max-w-2xl break-inside-avoid">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>{post.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{post.username}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: tr })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-left whitespace-pre-wrap">{post.content}</p>
        {post.image_url && (
          <div className="mt-4">
            <img 
              src={post.image_url} 
              alt="Gönderi resmi" 
              className="rounded-lg max-w-full h-auto object-cover" 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};