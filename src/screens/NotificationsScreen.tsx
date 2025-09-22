/**
 * Tela de Notificações (Variante B do teste A/B)
 * Exibe notificações de interações e atividades
 */

import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Heart, MessageCircle, Repeat2, UserPlus, Settings } from 'lucide-react';
import useRenderTime from '../hooks/useRenderTime';
import AnalyticsService from '../services/AnalyticsService';
import ABTestingService from '../services/ABTestingService';

interface Notification {
  id: string;
  type: 'like' | 'reply' | 'retweet' | 'follow';
  user: string;
  username: string;
  timestamp: Date;
  content?: string;
  postPreview?: string;
  isRead: boolean;
}

const NotificationsScreen: React.FC = () => {
  useRenderTime('Notifications');
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const variant = ABTestingService.getUserVariant();

  useEffect(() => {
    AnalyticsService.logScreenView('Notifications', variant);
    loadNotifications();
  }, [variant]);

  const loadNotifications = () => {
    // Simula carregamento de notificações
    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        type: 'like',
        user: 'Maria Santos',
        username: 'mariasantos',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        postPreview: 'Implementei um hook customizado para medir render time!',
        isRead: false
      },
      {
        id: 'notif-2',
        type: 'reply',
        user: 'João Silva',
        username: 'joaosilva',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        content: 'Muito interessante! Você poderia compartilhar o código?',
        postPreview: 'Testes A/B são fundamentais para validar hipóteses',
        isRead: false
      },
      {
        id: 'notif-3',
        type: 'follow',
        user: 'Dev Community',
        username: 'devcommunity',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: 'notif-4',
        type: 'retweet',
        user: 'Ana Developer',
        username: 'anadeveloper',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        postPreview: 'Performance é tudo! Reduzir 100ms no tempo de carregamento...',
        isRead: true
      },
      {
        id: 'notif-5',
        type: 'like',
        user: 'Pedro Tech',
        username: 'pedrotech',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        postPreview: 'Implementei um hook customizado para medir render time!',
        isRead: true
      }
    ];
    
    setNotifications(mockNotifications);
  };

  const handleMarkAllRead = () => {
    AnalyticsService.logButtonClick('Mark All Read', 'Notifications', variant);
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const handleNotificationClick = (notificationId: string) => {
    AnalyticsService.logButtonClick('Notification Item', 'Notifications', variant);
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'like':
        return <Heart className={`${iconClass} text-red-500`} fill="currentColor" />;
      case 'reply':
        return <MessageCircle className={`${iconClass} text-blue-500`} />;
      case 'retweet':
        return <Repeat2 className={`${iconClass} text-green-500`} />;
      case 'follow':
        return <UserPlus className={`${iconClass} text-purple-500`} />;
      default:
        return null;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'curtiu seu post';
      case 'reply':
        return 'respondeu ao seu post';
      case 'retweet':
        return 'retweetou seu post';
      case 'follow':
        return 'começou a seguir você';
      default:
        return 'interagiu com você';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Notificações</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-sm"
              >
                Marcar como lidas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => AnalyticsService.logButtonClick('Notification Settings', 'Notifications', variant)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="divide-y">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`border-b border-l-0 border-r-0 border-t-0 rounded-none cursor-pointer transition-colors ${
              !notification.isRead 
                ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleNotificationClick(notification.id)}
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex gap-3 flex-1 min-w-0">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {notification.user.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{notification.user}</span>
                      <span className="text-muted-foreground text-sm">
                        {getNotificationText(notification)}
                      </span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-2">
                      {formatTime(notification.timestamp)}
                    </div>
                    
                    {notification.content && (
                      <div className="text-sm mb-2 p-2 bg-muted/50 rounded">
                        "{notification.content}"
                      </div>
                    )}
                    
                    {notification.postPreview && (
                      <div className="text-sm text-muted-foreground">
                        "{notification.postPreview.length > 50 
                          ? notification.postPreview.substring(0, 50) + '...' 
                          : notification.postPreview}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhuma notificação ainda.</p>
          <p className="mt-2">Suas interações aparecerão aqui!</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsScreen;