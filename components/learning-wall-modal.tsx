'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Send, BookOpen, Users, AlertCircle, Heart, TrendingUp, Clock, Calendar, Pencil, Trash2, X, Check } from 'lucide-react';

interface LearningWallPost {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    profilePicture?: string | null;
  };
  likeCount: number;
  isLikedByUser: boolean;
}

interface LearningWallModalProps {
  lessonId: string;
  lessonTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearningWallModal({
  lessonId,
  lessonTitle,
  open,
  onOpenChange,
}: LearningWallModalProps) {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<LearningWallPost[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [isDeletingPost, setIsDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch posts when modal opens or sort changes
  useEffect(() => {
    if (open) {
      fetchPosts();
    }
  }, [open, lessonId, sortBy]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/learning-wall?sort=${sortBy}`);
      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts(data.posts || []);

      // Check if user has already posted (only check once when modal first opens)
      if (!hasPosted && data.hasUserPosted) {
        setHasPosted(true);
      }

      // Set current user ID from API response
      if (data.currentUserId) {
        setCurrentUserId(data.currentUserId);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load learning wall posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called!', { content, contentLength: content.length, trimmedLength: content.trim().length });

    if (!content.trim()) {
      console.log('ERROR: Content is empty');
      toast.error('Please write your reflection before posting');
      return;
    }

    if (content.trim().length < 10) {
      console.log('ERROR: Content too short - need at least 10 characters, got:', content.trim().length);
      toast.error('Reflection must be at least 10 characters');
      return;
    }

    if (content.trim().length > 500) {
      console.log('ERROR: Content too long - max 500 characters, got:', content.trim().length);
      toast.error('Reflection must be less than 500 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Posting to learning wall:', { lessonId, contentLength: content.trim().length });

      const response = await fetch(`/api/lessons/${lessonId}/learning-wall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.error || 'Failed to post');
      }

      const data = await response.json();
      console.log('Post created successfully:', data.post);

      // Add new post to the top of the list with like data
      const newPost: LearningWallPost = {
        ...data.post,
        likeCount: 0,
        isLikedByUser: false,
      };
      setPosts([newPost, ...posts]);
      setContent('');
      setHasPosted(true);

      // Set current user ID if not already set
      if (!currentUserId && data.post.user.id) {
        setCurrentUserId(data.post.user.id);
      }

      toast.success('Your reflection has been posted to the learning wall!');
    } catch (error: any) {
      console.error('Error posting to learning wall:', error);
      toast.error(error.message || 'Failed to post reflection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/learning-wall/${postId}/like`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to toggle like');

      const data = await response.json();

      // Update the post in the list
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, likeCount: data.likeCount, isLikedByUser: data.liked }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleStartEdit = (post: LearningWallPost) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (postId: string) => {
    if (!editContent.trim()) {
      toast.error('Please write your reflection before saving');
      return;
    }

    if (editContent.trim().length < 10) {
      toast.error('Reflection must be at least 10 characters');
      return;
    }

    if (editContent.trim().length > 500) {
      toast.error('Reflection must be less than 500 characters');
      return;
    }

    try {
      const response = await fetch(`/api/lessons/${lessonId}/learning-wall/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post');
      }

      const data = await response.json();

      // Update the post in the list
      setPosts(posts.map(post =>
        post.id === postId ? data.post : post
      ));

      setEditingPostId(null);
      setEditContent('');
      toast.success('Your reflection has been updated!');
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error(error.message || 'Failed to update reflection');
    }
  };

  const handleDelete = async (postId: string) => {
    setDeletingPostId(postId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPostId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/learning-wall/${deletingPostId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete post');
      }

      // Remove the post from the list
      setPosts(posts.filter(post => post.id !== deletingPostId));
      setDeletingPostId(null);
      setHasPosted(false); // Allow user to post again
      toast.success('Your reflection has been deleted');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(error.message || 'Failed to delete reflection');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletingPostId(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <DialogTitle className="text-2xl">VoDeMe Learning Wall</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {lessonTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6 pb-6">
          {/* Guidelines */}
          <Card className="mb-4 border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex gap-2 items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900 space-y-1">
                  <p className="font-medium">Share what you learned!</p>
                  <p className="text-xs text-blue-700">
                    Write a short reflection, key idea, or new vocabulary word you discovered.
                    Be respectful and keep comments school-appropriate.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post Form */}
          {!hasPosted && (
            <div className="mb-6 space-y-3">
              <Textarea
                placeholder="What did you learn from this lesson? (minimum 10 characters)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium ${
                    content.trim().length === 0
                      ? 'text-muted-foreground'
                      : content.trim().length < 10
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}
                >
                  {content.trim().length < 10 ? (
                    <>⚠️ {content.trim().length}/10 characters minimum (need {10 - content.trim().length} more)</>
                  ) : (
                    <>✓ {content.length}/500 characters</>
                  )}
                </span>
                <Button
                  onClick={() => {
                    console.log('Button clicked!');
                    handleSubmit();
                  }}
                  disabled={isSubmitting || content.trim().length < 10}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post to Wall
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {hasPosted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                Thank you for sharing! Your reflection has been posted. 🎉
              </p>
            </div>
          )}

          <Separator className="mb-4" />

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
              className={sortBy === 'recent' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              <Clock className="h-3 w-3 mr-1" />
              Recent
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('popular')}
              className={sortBy === 'popular' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Most Liked
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('oldest')}
              className={sortBy === 'oldest' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Oldest
            </Button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>What others learned ({posts.length})</span>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Be the first to share what you learned!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => {
                    const isEditing = editingPostId === post.id;
                    const isDeleting = deletingPostId === post.id;
                    const isEdited = new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime() + 1000; // 1 second tolerance
                    const isOwnPost = currentUserId === post.user.id;

                    return (
                      <Card key={post.id} className="border-slate-200">
                        <CardContent className="p-4">
                          {isDeleting ? (
                            // Delete confirmation
                            <div className="space-y-3">
                              <p className="text-sm font-medium text-slate-900">Delete this reflection?</p>
                              <p className="text-xs text-slate-600">This action cannot be undone.</p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={handleConfirmDelete}
                                  disabled={isDeletingPost}
                                >
                                  {isDeletingPost ? (
                                    <>
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Delete
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelDelete}
                                  disabled={isDeletingPost}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <Avatar className="h-10 w-10 flex-shrink-0">
                                <AvatarImage src={post.user.profilePicture || undefined} />
                                <AvatarFallback className="bg-purple-100 text-purple-700">
                                  {getInitials(post.user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {post.user.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(post.createdAt)}
                                  </span>
                                  {isEdited && (
                                    <span className="text-xs text-muted-foreground italic">
                                      (edited)
                                    </span>
                                  )}
                                </div>

                                {isEditing ? (
                                  // Edit mode
                                  <div className="space-y-2 mb-2">
                                    <Textarea
                                      value={editContent}
                                      onChange={(e) => setEditContent(e.target.value)}
                                      className="min-h-[80px] resize-none text-sm"
                                      maxLength={500}
                                    />
                                    <div className="flex items-center justify-between">
                                      <span
                                        className={`text-xs font-medium ${
                                          editContent.trim().length === 0
                                            ? 'text-muted-foreground'
                                            : editContent.trim().length < 10
                                            ? 'text-orange-600'
                                            : 'text-green-600'
                                        }`}
                                      >
                                        {editContent.trim().length < 10 ? (
                                          <>⚠️ {editContent.trim().length}/10 min</>
                                        ) : (
                                          <>✓ {editContent.length}/500</>
                                        )}
                                      </span>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={handleCancelEdit}
                                        >
                                          <X className="h-3 w-3 mr-1" />
                                          Cancel
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => handleSaveEdit(post.id)}
                                          disabled={editContent.trim().length < 10}
                                          className="bg-purple-600 hover:bg-purple-700"
                                        >
                                          <Check className="h-3 w-3 mr-1" />
                                          Save
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                                    {post.content}
                                  </p>
                                )}

                                <div className="flex items-center gap-3">
                                  {/* Like Button */}
                                  <button
                                    onClick={() => handleLike(post.id)}
                                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors group"
                                    disabled={isEditing}
                                  >
                                    <Heart
                                      className={`h-4 w-4 transition-all ${
                                        post.isLikedByUser
                                          ? 'fill-red-500 text-red-500'
                                          : 'group-hover:fill-red-100'
                                      }`}
                                    />
                                    <span className={post.isLikedByUser ? 'text-red-500 font-medium' : ''}>
                                      {post.likeCount}
                                    </span>
                                  </button>

                                  {/* Edit and Delete buttons - only show for own posts */}
                                  {!isEditing && isOwnPost && (
                                    <>
                                      <button
                                        onClick={() => handleStartEdit(post)}
                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600 transition-colors"
                                      >
                                        <Pencil className="h-3 w-3" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDelete(post.id)}
                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 transition-colors"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
