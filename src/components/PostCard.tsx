/**
 * Componente de Card do Post
 * Representa um tweet individual com botões para interação
 */

import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import AnalyticsService from '../services/AnalyticsService';
import ABTestingService from '../services/ABTestingService';

export interface Post {
  id: string;
  author: string;
  username: string;
  content: string;
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  isLiked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onRetweet?: (postId: string) => void;
  onReply?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  showDelete?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onRetweet, 
  onReply, 
  onDelete,
  showDelete = false 
}) => {
  const variant = ABTestingService.getUserVariant();

  const handleButtonClick = (buttonName: string, action?: () => void) => {
    AnalyticsService.logButtonClick(buttonName, 'PostCard', variant);
    action?.();
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <Card className="border-b border-l-0 border-r-0 border-t-0 rounded-none hover:bg-muted/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{post.author}</h4>
                <span className="text-muted-foreground">@{post.username}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground text-sm">{formatTime(post.timestamp)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleButtonClick('Delete Post', () => onDelete?.(post.id))}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleButtonClick('Post Options')}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
        
        <div className="flex items-center justify-between max-w-md">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
            onClick={() => handleButtonClick('Reply', () => onReply?.(post.id))}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{post.replies}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-green-600 hover:bg-green-50"
            onClick={() => handleButtonClick('Retweet', () => onRetweet?.(post.id))}
          >
            <Repeat2 className="w-4 h-4" />
            <span className="text-sm">{post.retweets}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 ${
              post.isLiked 
                ? 'text-red-600 hover:text-red-600 hover:bg-red-50' 
                : 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
            }`}
            onClick={() => handleButtonClick('Like', () => onLike?.(post.id))}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
            onClick={() => handleButtonClick('Share')}
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;