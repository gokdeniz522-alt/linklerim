import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export interface Comment {
  id: number;
  created_at: string;
  username: string;
  content: string;
  post_id: number;
}

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="flex items-start space-x-3 py-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-semibold">{comment.username}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
          </p>
        </div>
        <p className="text-sm mt-1">{comment.content}</p>
      </div>
    </div>
  );
};