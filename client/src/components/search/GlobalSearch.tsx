import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

interface SearchResult {
  id: string;
  name?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  type?: string;
  category?: string;
  tags?: string[];
  _formatted?: any;
}

interface SearchResponse {
  q: string;
  results: Record<string, {
    hits: SearchResult[];
    nbHits: number;
  }>;
  total: number;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [, navigate] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search API call
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async (): Promise<SearchResponse> => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        return { q: '', results: {}, total: 0 };
      }
      
      const response = await apiRequest('GET', `/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=3`);
      return response.json();
    },
    enabled: debouncedQuery.length >= 2
  });

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      inputRef.current?.blur();
    }
    if (e.key === 'Enter' && query.trim()) {
      handleSeeAllResults();
    }
  };

  const handleSeeAllResults = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult, type: string) => {
    setIsOpen(false);
    setQuery('');
    
    // Navigate to appropriate page based on result type
    switch (type) {
      case 'models':
        navigate(`/models/${result.id}`);
        break;
      case 'strategies':
        navigate(`/strategies/${result.id}`);
        break;
      case 'reports':
        navigate(`/reports/${result.id}`);
        break;
      case 'users':
        navigate(`/profiles/${result.id}`);
        break;
      case 'funding':
        navigate(`/funding/${result.id}`);
        break;
      case 'bounties':
        navigate(`/bounties/${result.id}`);
        break;
      default:
        break;
    }
  };

  const getResultTitle = (result: SearchResult) => {
    if (result._formatted) {
      return result._formatted.name || result._formatted.title || 
        `${result._formatted.firstName || ''} ${result._formatted.lastName || ''}`.trim();
    }
    return result.name || result.title || `${result.firstName || ''} ${result.lastName || ''}`.trim();
  };

  const getResultDescription = (result: SearchResult) => {
    if (result._formatted?.description) {
      // Truncate formatted description
      const desc = result._formatted.description;
      return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
    }
    if (result.description) {
      return result.description.length > 100 ? result.description.substring(0, 100) + '...' : result.description;
    }
    return '';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'models': 'AI Models',
      'strategies': 'Strategies', 
      'reports': 'Reports',
      'users': 'Users',
      'funding': 'Funding',
      'bounties': 'Bounties'
    };
    return labels[type] || type;
  };

  const hasResults = searchResults && searchResults.total > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search models, strategies, reports..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading && (
              <div className="p-4 text-center">
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </div>
            )}

            {!isLoading && !hasResults && debouncedQuery && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No results found for "{debouncedQuery}"
                </p>
              </div>
            )}

            {!isLoading && hasResults && (
              <div className="py-2">
                {Object.entries(searchResults.results).map(([type, typeResults]) => {
                  if (!typeResults.hits || typeResults.hits.length === 0) return null;
                  
                  return (
                    <div key={type} className="mb-4 last:mb-0">
                      <div className="px-4 py-2 bg-muted/50">
                        <h4 className="text-sm font-medium flex items-center justify-between">
                          {getTypeLabel(type)}
                          <Badge variant="secondary" className="text-xs">
                            {typeResults.nbHits}
                          </Badge>
                        </h4>
                      </div>
                      
                      {typeResults.hits.slice(0, 3).map((result, index) => (
                        <div
                          key={result.id || index}
                          onClick={() => handleResultClick(result, type)}
                          className="px-4 py-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {getResultTitle(result)}
                              </p>
                              {getResultDescription(result) && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {getResultDescription(result)}
                                </p>
                              )}
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {result.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {typeResults.nbHits > 3 && (
                        <div className="px-4 py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSeeAllResults}
                            className="text-xs w-full justify-center"
                          >
                            See all {typeResults.nbHits} {getTypeLabel(type).toLowerCase()}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="px-4 py-2 border-t">
                  <Button
                    variant="ghost"
                    onClick={handleSeeAllResults}
                    className="w-full justify-center text-sm"
                  >
                    See all {searchResults.total} results
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}