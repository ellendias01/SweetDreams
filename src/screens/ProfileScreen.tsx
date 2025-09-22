/**
 * Tela de Perfil do Usuário
 * Exibe informações do perfil e posts do usuário
 */

import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Link as LinkIcon, Edit } from 'lucide-react';
import PostCard, { Post } from '../components/PostCard';
import useRenderTime from '../hooks/useRenderTime';
import AnalyticsService from '../services/AnalyticsService';
import ABTestingService from '../services/ABTestingService';

const ProfileScreen: React.FC = () => {
  useRenderTime('Profile');
  
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const variant = ABTestingService.getUserVariant();

  // Profile data (em uma app real, viria de uma API)
  const profileData = {
    name: 'Você',
    username: 'voce',
    bio: 'Desenvolvedor Full Stack apaixonado por performance e testes A/B. Sempre buscando otimizar a experiência do usuário! 🚀',
    location: 'São Paulo, Brasil',
    website: 'https://github.com/voce',
    joinedDate: 'Março 2020',
    following: 127,
    followers: 89,
    posts: 42
  };

  useEffect(() => {
    AnalyticsService.logScreenView('Profile', variant);
    loadUserPosts();
  }, [variant]);

  const loadUserPosts = () => {
    // Simula carregamento de posts do usuário
    const mockUserPosts: Post[] = [
      {
        id: 'user-1',
        author: 'Você',
        username: 'voce',
        content: 'Implementei um hook customizado para medir render time! A diferença na performance é notável. #React #Performance',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        likes: 8,
        retweets: 2,
        replies: 3,
        isLiked: false
      },
      {
        id: 'user-2',
        author: 'Você',
        username: 'voce',
        content: 'Testes A/B são fundamentais para validar hipóteses de produto. Não assumam nada, testem tudo! 🧪',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likes: 15,
        retweets: 5,
        replies: 7,
        isLiked: true
      }
    ];
    
    setUserPosts(mockUserPosts);
  };

  const handleFollowClick = () => {
    AnalyticsService.logButtonClick('Follow Profile', 'Profile', variant);
    setIsFollowing(!isFollowing);
  };

  const handleEditProfile = () => {
    AnalyticsService.logButtonClick('Edit Profile', 'Profile', variant);
    // Em uma implementação real, abriria um modal de edição
    console.log('Edit profile clicked');
  };

  const handleLike = (postId: string) => {
    setUserPosts(prevPosts =>
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
    setUserPosts(prevPosts =>
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

  const handleDeletePost = (postId: string) => {
    setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10">
        <div className="p-4">
          <h1 className="text-xl font-semibold">Perfil</h1>
          <p className="text-sm text-muted-foreground">{profileData.posts} posts</p>
        </div>
      </div>

      {/* Profile Header */}
      <Card className="rounded-none border-b border-l-0 border-r-0 border-t-0">
        <CardHeader className="space-y-0">
          <div className="flex items-start justify-between">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">
                {profileData.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex gap-2">
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollowClick}
                className="rounded-full px-6"
              >
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditProfile}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <CardTitle className="text-xl">{profileData.name}</CardTitle>
              <p className="text-muted-foreground">@{profileData.username}</p>
            </div>
            
            <p className="text-sm">{profileData.bio}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profileData.location}
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a href={profileData.website} className="text-blue-600 hover:underline">
                  github.com/voce
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Entrou em {profileData.joinedDate}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="font-medium">{profileData.following}</span>
                <span className="text-muted-foreground"> Seguindo</span>
              </div>
              <div>
                <span className="font-medium">{profileData.followers}</span>
                <span className="text-muted-foreground"> Seguidores</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="secondary">Desenvolvedor</Badge>
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">Performance</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Posts do usuário */}
      <div className="divide-y">
        {userPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onRetweet={handleRetweet}
            onReply={handleReply}
            onDelete={handleDeletePost}
            showDelete={true}
          />
        ))}
      </div>

      {userPosts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhum post ainda.</p>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;