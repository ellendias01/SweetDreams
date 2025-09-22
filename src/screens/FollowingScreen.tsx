/**
 * Tela de Seguindo
 * Exibe posts das pessoas que o usuário segue
 */

import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { RefreshCw } from 'lucide-react';
import PostCard, { Post } from '../components/PostCard';
import useRenderTime from '../hooks/useRenderTime';
import AnalyticsService from '../services/AnalyticsService';
import ABTestingService from '../services/ABTestingService';

const FollowingScreen: React.FC = () => {
  useRenderTime('Following');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const variant = ABTestingService.getUserVariant();

  useEffect(() => {
    AnalyticsService.logScreenView('Following', variant);
    loadFollowingPosts();
  }, [variant]);

  const loadFollowingPosts = () => {
    // Simula carregamento de posts das pessoas que segue
    const mockFollowingPosts: Post[] = [
      {
        id: 'following-1',
        author: 'Ana Developer',
        username: 'anadeveloper',
        content: 'Alguém mais viciado em otimizar componentes React? Acabei de conseguir reduzir 40% no tempo de renderização usando React.memo() estrategicamente! 🎯',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        likes: 24,
        retweets: 6,
        replies: 9,
        isLiked: true
      },
      {
        id: 'following-2',
        author: 'Pedro Tech',
        username: 'pedrotech',
        content: 'Dica: Use o React DevTools Profiler para identificar re-renders desnecessários. É impressionante como alguns pequenos ajustes fazem diferença!',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        likes: 31,
        retweets: 12,
        replies: 15,
        isLiked: false
      },
      {
        id: 'following-3',
        author: 'CodeMaster',
        username: 'codemaster',
        content: 'Thread sobre A/B Testing 🧵\n\n1/ Sempre defina hipóteses claras antes de criar um teste\n2/ Garanta que sua amostra seja estatisticamente significativa\n3/ Rode o teste por tempo suficiente\n\n#ABTesting #DataDriven',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likes: 67,
        retweets: 28,
        replies: 22,
        isLiked: true
      },
      {
        id: 'following-4',
        author: 'UX Research',
        username: 'uxresearch',
        content: 'Estudos mostram que 47% dos usuários esperam que uma página carregue em 2 segundos ou menos. Performance não é luxo, é necessidade! ⚡',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 89,
        retweets: 34,
        replies: 18,
        isLiked: false
      }
    ];
    
    setPosts(mockFollowingPosts);
  };

  const handleRefresh = () => {
    AnalyticsService.logButtonClick('Refresh Following', 'Following', variant);
    setIsRefreshing(true);
    
    // Simula refresh dos posts
    setTimeout(() => {
      loadFollowingPosts();
      setIsRefreshing(false);
    }, 1000);
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleRetweet = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, retweets: post.retweets + 1 }
          : post
      )
    );
  };

  const handleReply = (postId: string) => {
    console.log(`Respondendo ao post ${postId}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Seguindo</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </span>
          </Button>
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onRetweet={handleRetweet}
            onReply={handleReply}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Você não está seguindo ninguém ainda.</p>
          <p className="mt-2">Encontre pessoas interessantes para seguir!</p>
        </div>
      )}
    </div>
  );
};

export default FollowingScreen;