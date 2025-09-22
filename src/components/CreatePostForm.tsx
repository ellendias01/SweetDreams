/**
 * Componente de Formulário para Criar Posts
 * Implementa funcionalidade CRUD para posts
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import AnalyticsService from '../services/AnalyticsService';
import ABTestingService from '../services/ABTestingService';

interface CreatePostFormProps {
  onPost: (content: string) => void;
  isLoading?: boolean;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPost, isLoading = false }) => {
  const [content, setContent] = useState('');
  const variant = ABTestingService.getUserVariant();
  const maxChars = 280;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && content.length <= maxChars) {
      AnalyticsService.logButtonClick('Create Post', 'CreatePostForm', variant);
      onPost(content.trim());
      setContent('');
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= maxChars) {
      setContent(newContent);
    }
  };

  const remainingChars = maxChars - content.length;
  const isNearLimit = remainingChars <= 20;
  const isOverLimit = remainingChars < 0;

  return (
    <Card className="border-b rounded-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">O que está acontecendo?</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>EU</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <Textarea
                value={content}
                onChange={handleTextareaChange}
                placeholder="O que está acontecendo?"
                className="min-h-[80px] border-none resize-none text-lg placeholder:text-muted-foreground focus-visible:ring-0"
                disabled={isLoading}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Aqui poderiam ir botões de mídia, emoji, etc. */}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`text-sm ${
                    isOverLimit 
                      ? 'text-destructive' 
                      : isNearLimit 
                        ? 'text-orange-500' 
                        : 'text-muted-foreground'
                  }`}>
                    {remainingChars}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!content.trim() || isOverLimit || isLoading}
                    className="rounded-full px-6"
                  >
                    {isLoading ? 'Postando...' : 'Postar'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;