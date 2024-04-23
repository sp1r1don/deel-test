import { ChangeEvent, FC, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AutocompleteSuggestions } from 'src/components/AutocompleteSuggestions.tsx';
import { ICountry, Suggestion } from 'src/types/data.ts';

const SUGGESTION_TIMEOUT = 300;

const commonInputStyles = 'p-4 bg-transparent border-none';

export const Autocomplete: FC<{
  options: { name: string; value: string | number };
}> = () => {
  const [userInput, setUserInput] = useState('');
  const [countries, setCountries] = useState<ICountry[] | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState<ICountry[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flag,cca2,cca3')
      .then((response) => response.json())
      .then((data: ICountry[]) => {
        setSuggestionsList(data);
        setCountries(data); // Handle the data in this block
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    setSuggestion('');
    setSelectedIndex(-1);

    if (!userInput) {
      setSuggestionsList(countries);
      return;
    }

    const abortController = new AbortController();

    const suggestionRequestTimout = setTimeout(() => {
      setFetchingSuggestions(true);
      fetch(`https://restcountries.com/v3.1/name/${userInput}?fields=name,flag,cca2,cca3`, {
        signal: abortController.signal,
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Network fail: ' + resp.statusText);
          }
          return resp.json();
        })
        .then((data: ICountry[]) => {
          setSuggestionsList(data);
        })
        .catch((e) => {
          console.error(e);

          if (abortController.signal.aborted) return;

          setSuggestionsList(null);
        })
        .finally(() => setFetchingSuggestions(false));
    }, SUGGESTION_TIMEOUT);

    return () => {
      clearTimeout(suggestionRequestTimout);
      abortController.abort();
    };
  }, [userInput]);

  const sortedSuggestions = useMemo(() => {
    if (!suggestionsList) return null;
    if (!userInput) return suggestionsList;

    return [...suggestionsList].sort((a, b) => {
      if (a.cca3.toLowerCase().indexOf(userInput.toLowerCase()) === 0) return 1;
      if (a.name.common.toLowerCase().indexOf(userInput.toLowerCase()) === 0) return 1;
      if (b.name.common.toLowerCase().indexOf(userInput.toLowerCase()) === 0) return 1;
      return 0;
    });
  }, [suggestionsList]);

  const formattedSuggestions = useMemo(() => {
    if (!sortedSuggestions) return [];

    return sortedSuggestions.map((el) => ({
      name: `${el.name.common} (${el.name.official} [${el.cca3}])`,
      value: el.name.common,
    }));
  }, [sortedSuggestions]);

  useEffect(() => {
    if (!sortedSuggestions || !showSuggestions) {
      setSuggestion('');
      return;
    }

    if (userInput && sortedSuggestions[0].name.common.indexOf(userInput) === 0) {
      setSuggestion(sortedSuggestions[0].name.common);
    } else {
      setSuggestion('');
    }
  }, [sortedSuggestions]);

  useEffect(() => {
    const selectedElement = document.querySelector('.arrow-selected');
    selectedElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedIndex]);

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setUserInput(e.target.value);
  }

  function handleInputBlur() {
    setSuggestion('');
    setShowSuggestions(false);
  }

  function handleSuggestionSelect(el: Suggestion) {
    setUserInput(el.value);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!sortedSuggestions) return;

    if (e.key === 'ArrowDown' && selectedIndex < sortedSuggestions.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (e.key === 'ArrowUp' && selectedIndex > 0) {
      e.preventDefault();
      setSelectedIndex(selectedIndex - 1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      setUserInput(sortedSuggestions[selectedIndex].name.common);
      inputRef.current!.blur();
    } else if (e.key === 'Enter') {
      setUserInput(suggestion);
    }
  };

  return (
    <div>
      <div className="border border-gray-400 rounded inline-block">
        <div className="relative">
          <input disabled className={`${commonInputStyles} opacity-40`} value={suggestion} />
          <input
            ref={inputRef}
            placeholder="Start typing country"
            className={`${commonInputStyles} absolute left-0 top-0`}
            value={userInput}
            onChange={handleInput}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
          />
          {showSuggestions && (
            <AutocompleteSuggestions
              suggestions={formattedSuggestions}
              fetching={fetchingSuggestions}
              onSelect={handleSuggestionSelect}
              searchString={userInput}
              selectedIndex={selectedIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
};
