import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { upvotePost } from "@/utils/api";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: number;
  message: string;
  category: string;
  upvotes: number;
  created_at: string;
  is_hidden: boolean;
}

interface Props {
  post: Post;
  onPostUpdated?: () => void;
  showModerationControls?: boolean;
}

export const PostCard = ({ post, onPostUpdated }: Props) => {
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async () => {
    setIsUpvoting(true);
    try {
      await upvotePost(post.id);
      toast({ title: "Upvoted!" });
      onPostUpdated?.();
    } catch (err) {
      toast({ title: "Failed to upvote", variant: "destructive" });
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Badge>{post.category}</Badge>
          <span className="text-xs text-muted-foreground">
            <Clock className="inline h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="mb-2">{post.message}</p>
        <Button variant="ghost" size="sm" onClick={handleUpvote} disabled={isUpvoting}>
          <ThumbsUp className="h-4 w-4 mr-1" /> {post.upvotes}
        </Button>
      </CardContent>
    </Card>
  );
};
