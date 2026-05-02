import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

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
  status?: string;
  createdAt?: string;
  _formatted?: any;
}

interface SearchResponse {
  q: string;
  results: Record<string, {
    hits: SearchResult[];
    nbHits: number;
  }>;
  total: number;
  limit: number;
  offset: number;
}

export default function SearchPage() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['models', 'strategies', 'reports', 'users', 'funding', 'bounties']);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 12;

  // Get query from URL on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    const urlTypes = urlParams.get('types');
    
    if (urlQuery) {
      setQuery(urlQuery);
    }
    if (urlTypes) {
      setSelectedTypes(urlTypes.split(','));
    }
  }, []);

  // Update URL when search params change
  useEffect(() => {
    if (query) {
      const params = new URLSearchParams();
      params.set('q', query);
      if (selectedTypes.length < 6) {
        params.set('types', selectedTypes.join(','));
      }
      navigate(`/search?${params.toString()}`, { replace: true });
    }
  }, [query, selectedTypes, navigate]);

  const offset = (currentPage - 1) * limit;

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search-page', query, selectedTypes, offset, limit],
    queryFn: async (): Promise<SearchResponse> => {
      if (!query.trim()) {
        return { q: '', results: {}, total: 0, limit: 0, offset: 0 };
      }
      
      const params = new URLSearchParams({
        q: query,
        types: selectedTypes.join(','),
        limit: limit.toString(),
        offset: offset.toString()
      });
      
      const response = await apiRequest('GET', `/api/search?${params.toString()}`);
      return response.json();
    },
    enabled: !!query.trim()
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleResultClick = (result: SearchResult, type: string) => {
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
      return result._formatted.description;
    }
    return result.description || '';
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

  const typeOptions = [
    { value: 'models', label: 'AI Models' },
    { value: 'strategies', label: 'Strategies' },
    { value: 'reports', label: 'Reports' },
    { value: 'users', label: 'Users' },
    { value: 'funding', label: 'Funding' },
    { value: 'bounties', label: 'Bounties' }
  ];

  const hasResults = searchResults && searchResults.total > 0;
  const totalPages = hasResults ? Math.ceil(searchResults.total / limit) : 0;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Search GeFi Platform</h1>
            
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models, strategies, reports, and more..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={!query.trim()}>
                Search
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="px-3"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </form>

            {/* Filters */}
            {showFilters && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-sm">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Search In:</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {typeOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={option.value}
                              checked={selectedTypes.includes(option.value)}
                              onCheckedChange={() => handleTypeToggle(option.value)}
                            />
                            <label htmlFor={option.value} className="text-sm">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By:</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="name">Name (A-Z)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Search Results */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Searching...</p>
            </div>
          )}

          {!isLoading && query && !hasResults && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}

          {!isLoading && hasResults && (
            <div>
              {/* Results Summary */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Found {searchResults.total} results for "{searchResults.q}"
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>

              {/* Results by Type */}
              <div className="space-y-8">
                {Object.entries(searchResults.results).map(([type, typeResults]) => {
                  if (!typeResults.hits || typeResults.hits.length === 0) return null;
                  
                  return (
                    <div key={type}>
                      <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-xl font-semibold">{getTypeLabel(type)}</h2>
                        <Badge variant="secondary">
                          {typeResults.nbHits}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {typeResults.hits.map((result, index) => (
                          <Card 
                            key={result.id || index}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleResultClick(result, type)}
                          >
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                                {getResultTitle(result)}
                              </h3>
                              {getResultDescription(result) && (
                                <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                                  {getResultDescription(result)}
                                </p>
                              )}
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {result.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {result.createdAt && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(result.createdAt).toLocaleDateString()}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}