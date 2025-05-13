import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { getCitySuggestions } from '../services/weatherService';
import { AutocompleteResult } from '../types';

interface SearchBarProps {
  onSearch: (city: string) => void;
  recentSearches: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, recentSearches }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      
      try {
        const results = await getCitySuggestions(query);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: AutocompleteResult) => {
    setQuery(suggestion.name);
    onSearch(suggestion.name);
    setShowSuggestions(false);
  };

  const handleRecentSearchClick = (city: string) => {
    setQuery(city);
    onSearch(city);
  };

  return (
    <div ref={searchBarRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for a city..."
          className="w-full p-3 pl-10 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition duration-300"
        >
          <Search size={20} />
        </button>
      </form>

      {/* Autocomplete suggestions */}
      {showSuggestions && (query.length >= 3 || recentSearches.length > 0) && (
        <div className="absolute mt-1 w-full bg-white/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden z-10 divide-y divide-gray-200 transition-all duration-300 ease-in-out">
          {isLoading && (
            <div className="p-3 text-gray-700 text-sm">Loading suggestions...</div>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="p-2 text-xs font-semibold text-gray-500 bg-gray-100">
                Recent Searches
              </div>
              {recentSearches.slice(0, 3).map((city, index) => (
                <div
                  key={`recent-${index}`}
                  className="p-3 hover:bg-blue-50 cursor-pointer text-gray-700 transition duration-200"
                  onClick={() => handleRecentSearchClick(city)}
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-blue-400">
                      <Search size={16} />
                    </span>
                    {city}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* API suggestions */}
          {suggestions.length > 0 && (
            <div>
              {query.length >= 3 && (
                <div className="p-2 text-xs font-semibold text-gray-500 bg-gray-100">
                  Suggestions
                </div>
              )}
              {suggestions.map((suggestion, index) => (
                <div
                  key={`suggestion-${index}`}
                  className="p-3 hover:bg-blue-50 cursor-pointer text-gray-700 transition duration-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-500">
                    {suggestion.state ? `${suggestion.state}, ` : ''}
                    {suggestion.country}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No suggestions */}
          {!isLoading && query.length >= 3 && suggestions.length === 0 && (
            <div className="p-3 text-gray-700">No cities found. Try a different search.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;