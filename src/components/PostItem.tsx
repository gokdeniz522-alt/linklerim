import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Comment, CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { PollDisplay } from "./PollDisplay";

interface PollOption {
  id: number;
  option_text: string;
  votes: number;
}
interface Poll {
  id: number;
  question: string;
  poll_options: PollOption[];
}

export interface Post {
  id: number;
  created_at: string;
  username: string;
  content: string;
  image_url: string | null;
  video_player_url: string | null;
  polls: Poll[] | null;
}

interface PostItemProps {
  post: Post;
}

export const PostItem = ({ post }: PostItemProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const poll = post.polls?.[0];

  const fetchComments = async () => {
    if (comments.length > 0) return;

    setIsLoadingComments(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    if (data) setComments(data);
    if (error) console.error("Error fetching comments:", error);
    setIsLoadingComments(false);
  };

  const handleToggleComments = () => {
    const newShowState = !showComments;
    setShowComments(newShowState);
    if (newShowState) fetchComments();
  };
  
  const handleCommentAdded = (newComment: Comment) => {
    setComments(currentComments => [...currentComments, newComment]);
  };

  return (
    <Card className="w-full break-inside-avoid">
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
          <div className="mt-4 overflow-hidden rounded-lg border bg-muted">
            <img 
              src={post.image_url} 
              alt="Gönderi resmi" 
              className="w-full h-auto max-h-[60vh] object-contain mx-auto" 
            />
          </div>
        )}
        {post.video_player_url && (
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border bg-black">
             <video
              src={post.video_player_url}
              width="100%"
              height="100%"
              controls
              className="w-full h-full object-contain"
            >
              Tarayıcınız video etiketini desteklemiyor.
            </video>
          </div>
        )}
        {poll && <PollDisplay poll={poll} />}
      </CardContent>
      <CardFooter className="flex-col items-start">
        <Button variant="ghost" size="sm" onClick={handleToggleComments} className="-ml-2">
          <MessageSquare className="mr-2 h-4 w-4" />
          Yorumlar
        </Button>
        {showComments && (
          <div className="w-full mt-4">
            <Separator />
            {isLoadingComments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <div className="divide-y">
                {comments.length > 0 ? (
                  comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Henüz yorum yok.</p>
                )}
              </div>
            )}
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};