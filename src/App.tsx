import { useState } from "react";
import "./App.css";

function App() {
  const [places, setPlaces] = useState<string[]>([]);

  const fetchPlaceName = async (text: string) => {
    try {
      const result = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${
          import.meta.env.VITE_MAPBOX
        }&autocomplete=true&types=place&fuzzymatch=false`
      );
      if (!result.ok) throw new Error(result.statusText);
      return result.json();
    } catch (err) {
      return { error: err };
    }
  };

  const handleChange = async (value: string) => {
    console.log(value);
    if (value.length > 2 && !places.includes(value)) {
      const placeResults: Places = await fetchPlaceName(value);
      placeResults.features && setPlaces(placeResults.features.map((place: Place) => place.place_name));
      console.log("placeResults", placeResults);
    }
  };

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <form className='w-full md:w-3/4 mx-5'>
        <input
          className='appearance-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          list='places'
          placeholder='Enter a city, town or place?'
          onChange={(e) => handleChange(e.target.value)}
        />
        <datalist id='places'>
          {places.map((place, index) => (
            <option key={`place-${index}`}>{place}</option>
          ))}
        </datalist>
      </form>
    </div>
  );
}

type Places = {
  features: Place[];
};

type Place = {
  place_name: string;
};

export default App;
