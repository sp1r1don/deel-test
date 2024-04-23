import { Autocomplete } from 'src/components/Autocomplete.tsx';

export const App = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">
        Find your country with amazing autocomplete component
      </h1>
      <Autocomplete />
    </div>
  );
};
