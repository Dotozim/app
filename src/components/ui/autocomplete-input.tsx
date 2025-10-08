
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface AutocompleteInputProps extends Omit<React.ComponentProps<'input'>, 'onChange'> {
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect?: (suggestion: string) => void;
}

export const AutocompleteInput = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({ suggestions, value, onChange, className, onKeyDown, onSuggestionSelect, ...props }, ref) => {
    const [suggestion, setSuggestion] = useState('');

    useEffect(() => {
      if (value) {
        const foundSuggestion = suggestions.find(s =>
          s.toLowerCase().startsWith(value.toLowerCase())
        );
        setSuggestion(foundSuggestion || '');
      } else {
        setSuggestion('');
      }
    }, [value, suggestions]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion && value) {
        const suggestionText = suggestion.toLowerCase();
        const valueText = value.toLowerCase();
        if (suggestionText === valueText) return;
        
        e.preventDefault();
        onChange(suggestion);
        onSuggestionSelect?.(suggestion);
      }
      if (onKeyDown) {
        onKeyDown(e);
      }
    };
    
    const displaySuggestion = suggestion && value && suggestion.toLowerCase().startsWith(value.toLowerCase())
        ? value + suggestion.substring(value.length)
        : '';


    return (
      <div className="relative w-full">
        <Input
          className={cn('absolute inset-0 bg-transparent text-muted-foreground pointer-events-none', className)}
          value={displaySuggestion}
          readOnly
          tabIndex={-1}
        />
        <Input
          ref={ref}
          className={cn('relative bg-transparent', className)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </div>
    );
  }
);

AutocompleteInput.displayName = 'AutocompleteInput';
