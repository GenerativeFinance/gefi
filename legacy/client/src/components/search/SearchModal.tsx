import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, X, TrendingUp, FileText, Bot, ExternalLink, Clock, Star, DollarSign, MessageCircle, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface SearchResult {
  id: string | number;
  // Different indexes may return different fields
  name?: string;         // models/strategies
  title?: string;        // reports/funding/bounties
  description?: string;
  canonicalPath?: string; // optional for models
  slug?: string;          // optional for models
  tags?: string[];
  category?: string;
  status?: string;
  rating?: number;
  updatedAt?: string;
  firstName?: string;    // users
  lastName?: string;     // users
}

interface GroupedHits {
  hits: SearchResult[];
  nbHits: number;
  processingTimeMs?: number;
}

interface SearchResponse {
  q: string;
  results: Record<string, GroupedHits>;
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

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch search results from the active API
  const { data: searchResults, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return { q: '', results: {}, total: 0 };
      }
      // Ask for all supported types including funding and bounties
      const url = `/api/search?q=${encodeURIComponent(debouncedQuery)}&types=models,strategies,reports,users,funding,bounties&limit=8`;
      const res = await apiRequest('GET', url);
      return res.json();
    },
    enabled: debouncedQuery.length > 0
  });

  // Autofocus when opening
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Popular suggestions
  const popularSearches = [
    'Risk Assessment',
    'Portfolio Optimization',
    'DeFi Strategy',
    'Trading Bots',
    'Sentiment Analysis',
    'Market Forecasting'
  ];

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const diffH = Math.floor((Date.now() - date.getTime()) / 36e5);
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    if (diffH < 168) return `${Math.floor(diffH / 24)}d ago`;
    return `${Math.floor(diffH / 168)}w ago`;
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'models': return <Bot className="w-4 h-4" />;
      case 'strategies': return <TrendingUp className="w-4 h-4" />;
      case 'reports': return <FileText className="w-4 h-4" />;
      case 'funding': return <DollarSign className="w-4 h-4" />;
      case 'bounties': return <Star className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />; // users
    }
  };

  const getDisplayName = (r: SearchResult) =>
    r.name || r.title || `${r.firstName || ''} ${r.lastName || ''}`.trim() || 'Untitled';

  const getDisplayDescription = (r: SearchResult) => r.description || '';

  const getResultUrl = (r: SearchResult, type: string): string => {
    switch (type) {
      case 'models': // prefer canonicalPath or slug, fallback to id
      case 'model':
        if (r.canonicalPath) return r.canonicalPath.startsWith('/') ? r.canonicalPath : `/${r.canonicalPath}`;
        if (r.slug) return `/model/${r.slug}`;
        return `/model/${r.id}`;
      case 'strategies':
        return `/strategies/${r.id}`;
      case 'reports':
        return `/reports/${r.id}`;
      case 'users':
        return `/profiles/${r.id}`;
      case 'funding':
        return `/funding/${r.id}`;
      case 'bounties':
        return `/bounties/${r.id}`;
      default:
        return '#';
    }
  };

  const getHits = (tab: string): SearchResult[] => {
    if (!searchResults?.results) return [];
    return searchResults.results[tab]?.hits || [];
  };

  const getCount = (tab: string): number => {
    if (!searchResults?.results) return 0;
    return searchResults.results[tab]?.nbHits || 0;
  };

  const currentHits = getHits(activeTab);

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
            placeholder="Search AI models, strategies, reports, users, funding, and bounties..."
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="models" className="flex items-center gap-2">
              {getTabIcon('models')}
              Models ({getCount('models')})
            </TabsTrigger>
            <TabsTrigger value="strategies" className="flex items-center gap-2">
              {getTabIcon('strategies')}
              Strategies ({getCount('strategies')})
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              {getTabIcon('reports')}
              Reports ({getCount('reports')})
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Users ({getCount('users')})
            </TabsTrigger>
            <TabsTrigger value="funding" className="flex items-center gap-2">
              {getTabIcon('funding')}
              Funding ({getCount('funding')})
            </TabsTrigger>
            <TabsTrigger value="bounties" className="flex items-center gap-2">
              {getTabIcon('bounties')}
              Bounties ({getCount('bounties')})
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
                  Find AI models, strategies, reports, users, funding, and bounties
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

            {/* No results */}
            {query && !isLoading && !error && currentHits.length === 0 && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">Try different keywords or switch categories</p>
              </div>
            )}

            {/* Results */}
            {currentHits.length > 0 && (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-3">
                  {currentHits.map((r) => (
                    <div key={`${activeTab}-${r.id}`} className="group p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Link href={getResultUrl(r, activeTab)} onClick={onClose}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {getDisplayName(r)}
                            </h4>
                            {getDisplayDescription(r) && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {getDisplayDescription(r)}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {r.tags?.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {r.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-muted-foreground">{r.rating.toFixed(1)}</span>
                                </div>
                              )}
                              {r.updatedAt && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {formatTimeAgo(r.updatedAt)}
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