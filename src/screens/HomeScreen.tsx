/**
 * Tela Principal (Home)
 * Exibe feed de posts e formulário para criar novos posts
 */

import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Settings, RefreshCw, Database } from 'lucide-react';
import CreatePostForm from '../components/CreatePostForm';
import PostCard, { Post } from '../components/PostCard';
import useRenderTime from '../hooks/useRenderTime';
import AnalyticsService from '../services/AnalyticsService';
import ABTestingService from '../services/ABTestingService';

interface HomeScreenProps {
  onShowDashboard: () => void;
  onVariantToggle: () => void;
  currentVariant: 'A' | 'B';
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onShowDashboard, onVariantToggle, currentVariant }) => {
  useRenderTime('Home');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const variant = currentVariant;

  // Log screen view quando componente montar
  useEffect(() => {
    AnalyticsService.logScreenView('Home', variant);
    
    // Carrega posts iniciais
    loadInitialPosts();
  }, [variant]);

  const loadInitialPosts = () => {
    // Simula carregamento de posts do backend
    const mockPosts: Post[] = [
      {
        id: '1',
        author: 'João Silva',
        username: 'joaosilva',
        content: 'Acabei de implementar um sistema de A/B testing incrível! 🚀 A diferença na métrica de engajamento já é visível.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
        likes: 12,
        retweets: 3,
        replies: 5,
        isLiked: false
      },
      {
        id: '2',
        author: 'Maria Santos',
        username: 'mariasantos',
        content: 'Performance é tudo! Reduzir 100ms no tempo de carregamento pode aumentar as conversões em até 7%. Sempre vale a pena otimizar. 💡',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
        likes: 28,
        retweets: 8,
        replies: 12,
        isLiked: true
      },
      {
        id: '3',
        author: 'Dev Community',
        username: 'devcommunity',
        content: 'Dica do dia: Use React.memo() e useMemo() com sabedoria. Otimização prematura pode ser o root of all evil, mas otimização inteligente é arte! 🎨\n\n#React #Performance',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h atrás
        likes: 45,
        retweets: 15,
        replies: 8,
        isLiked: false
      }
    ];
    
    setPosts(mockPosts);
  };

  const handleCreatePost = (content: string) => {
    setIsLoading(true);
    
    // Simula chamada para API
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now().toString(),
        author: 'Você',
        username: 'voce',
        content,
        timestamp: new Date(),
        likes: 0,
        retweets: 0,
        replies: 0,
        isLiked: false
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setIsLoading(false);
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
    // Em uma implementação real, abriria um modal de resposta
    console.log(`Respondendo ao post ${postId}`);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header com botões */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Home</h1>
            <Badge variant="outline">
              Variante {variant}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                AnalyticsService.logButtonClick('Toggle Variant', 'Home', variant);
                onVariantToggle();
              }}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Trocar para {variant === 'A' ? 'B' : 'A'}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                AnalyticsService.logButtonClick('Dashboard Access', 'Home', variant);
                onShowDashboard();
              }}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Formulário de criação de posts */}
      <CreatePostForm onPost={handleCreatePost} isLoading={isLoading} />

      {/* Feed de posts */}
      <div className="divide-y">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onRetweet={handleRetweet}
            onReply={handleReply}
            onDelete={handleDeletePost}
            showDelete={post.username === 'voce'}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhum post ainda. Seja o primeiro a postar!</p>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;