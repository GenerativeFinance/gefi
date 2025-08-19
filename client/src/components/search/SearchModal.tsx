import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, X, TrendingUp, FileText, Bot, ExternalLink, Clock, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface SearchResult {
  id: string | number;
  name: string;
  description?: string;
  url: string;
  canonicalPath?: string;
  slug?: string;
  tags?: string[];
  category?: string;
  status?: string;
  rating?: number;
  updatedAt?: string;
  type: 'model' | 'strategy' | 'report' | 'user' | 'bounty';
}

interface SearchResponse {
  models: SearchResult[];
  strategies: SearchResult[];
  reports: SearchResult[];
  users: SearchResult[];
  bounties: SearchResult[];
  total: number;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('models');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search API call
  const { data: searchResults, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return { models: [], strategies: [], reports: [], users: [], bounties: [], total: 0 };
      }
      const response = await apiRequest('GET', `/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      return response.json();
    },
    enabled: debouncedQuery.length > 0,
  });

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Popular search suggestions
  const popularSearches = [
    'Risk Assessment',
    'Portfolio Optimization', 
    'DeFi Strategy',
    'Trading Bots',
    'Sentiment Analysis',
    'Market Forecasting'
  ];

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'models': return <Bot className="w-4 h-4" />;
      case 'strategies': return <TrendingUp className="w-4 h-4" />;
      case 'reports': return <FileText className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const getCurrentResults = (): SearchResult[] => {
    if (!searchResults) return [];
    return searchResults[activeTab as keyof SearchResponse] as SearchResult[] || [];
  };

  const getTotalCount = (tab: string): number => {
    if (!searchResults) return 0;
    return (searchResults[tab as keyof SearchResponse] as SearchResult[])?.length || 0;
  };

  const getResultUrl = (result: SearchResult): string => {
    // For models, use canonicalPath or fallback to /model/:slug
    if (result.type === 'model') {
      if (result.canonicalPath) return result.canonicalPath;
      if (result.slug) return `/model/${result.slug}`;
    }
    // For other types, use the provided URL
    return result.url;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-background/95 backdrop-blur-sm border border-border/50 shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search GeFi Platform
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={inputRef}
            placeholder="Search AI models, strategies, reports, users, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-12 text-lg"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Search Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="models" className="flex items-center gap-2">
              {getTabIcon('models')}
              Models ({getTotalCount('models')})
            </TabsTrigger>
            <TabsTrigger value="strategies" className="flex items-center gap-2">
              {getTabIcon('strategies')}
              Strategies ({getTotalCount('strategies')})
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              {getTabIcon('reports')}
              Reports ({getTotalCount('reports')})
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Users ({getTotalCount('users')})
            </TabsTrigger>
            <TabsTrigger value="bounties" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Bounties ({getTotalCount('bounties')})
            </TabsTrigger>
          </TabsList>

          {/* Results Content */}
          <div className="mt-4 min-h-[300px]">
            {/* Loading State */}
            {isLoading && (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Search temporarily unavailable. Please try again.</p>
              </div>
            )}

            {/* Empty State - No Query */}
            {!query && !isLoading && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Search the GeFi Platform</h3>
                <p className="text-muted-foreground mb-6">
                  Find AI models, trading strategies, reports, and more
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Popular searches:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularSearches.map((search) => (
                      <Button
                        key={search}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(search)}
                        className="text-xs"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* No Results */}
            {query && !isLoading && !error && getCurrentResults().length === 0 && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching for AI models, strategies, or reports
                </p>
              </div>
            )}

            {/* Results List */}
            {getCurrentResults().length > 0 && (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-3">
                  {getCurrentResults().map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="group p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Link href={getResultUrl(result)} onClick={onClose}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {result.name}
                            </h4>
                            {result.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {result.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {result.tags?.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {result.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-muted-foreground">
                                    {result.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {result.updatedAt && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {formatTimeAgo(result.updatedAt)}
                                </div>
                              )}
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <div>
            {searchResults?.total ? `${searchResults.total} total results` : ''}
          </div>
          <div className="flex items-center gap-4">
            <span>Press ESC to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}