import { FC } from 'react';
import { Suggestion } from 'src/types/data.ts';

const HighlightedText: FC<{ searchString: string; item: Suggestion }> = ({
  searchString,
  item,
}) => {
  if (!searchString) return item.name;

  const parts = item.name.split(new RegExp(`(${searchString})`, 'gi'));

  return (
    <span>
      {parts.map((part, index) => (
        <span
          key={index}
          className={part.toLowerCase() === searchString.toLowerCase() ? 'text-green-500' : ''}
        >
          {part}
        </span>
      ))}
    </span>
  );
};

type Props = {
  searchString: string;
  fetching: boolean;
  suggestions: Suggestion[] | null;
  selectedIndex: number;
  onSelect: (item: Suggestion) => void;
};

export const AutocompleteSuggestions: FC<Props> = ({
  searchString,
  fetching,
  suggestions,
  selectedIndex,
  onSelect,
}) => {
  return (
    <div
      className="absolute rounded shadow p-2 min-w-full max-h-96 overflow-auto"
      style={{ top: 'calc(100% + .5rem)' }}
    >
      {fetching
        ? 'Fetching countries...'
        : !suggestions || suggestions.length === 0
          ? 'No matches'
          : suggestions.map((el, index) => (
              <div
                key={el.value}
                onMouseDown={() => onSelect(el)}
                className={`whitespace-nowrap -mx-2 py-1 px-2 hover:bg-gray-200 cursor-pointer ${el.value === searchString ? '!bg-green-100 cursor-default' : ''} ${selectedIndex === index ? '!bg-blue-100 arrow-selected' : ''}`}
              >
                <HighlightedText searchString={searchString} item={el} />
              </div>
            ))}
    </div>
  );
};
