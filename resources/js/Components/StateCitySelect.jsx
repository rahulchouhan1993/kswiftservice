import React, { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";

export default function StateCitySelect({ states = {}, cities = [], value = {}, onChange }) {
    const [selectedState, setSelectedState] = useState(value.state_id || "");
    const [filteredCities, setFilteredCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(value.city_id || "");

    // Filter cities when state changes
    useEffect(() => {
        if (selectedState) {
            const filtered = cities.filter((city) => city.state_id === parseInt(selectedState));
            setFilteredCities(filtered);
        } else {
            setFilteredCities([]);
        }
        setSelectedCity(""); // reset city when state changes
    }, [selectedState, cities]);

    // Notify parent form
    useEffect(() => {
        if (onChange) {
            onChange({
                state_id: selectedState,
                city_id: selectedCity,
            });
        }
    }, [selectedState, selectedCity]);

    // Tailwind classes for light/dark mode
    const selectClasses =
        "w-full rounded-md shadow-sm ring-0 dark:bg-[#131836] dark:text-gray-200 ";

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div>
                <InputLabel htmlFor="state" value="State" />
                <select
                    id="state"
                    className={selectClasses}
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                >
                    <option value="">Select State</option>
                    {Object.entries(states).map(([name, id]) => (
                        <option key={id} value={id}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <InputLabel htmlFor="city" value="City" />
                <select
                    id="city"
                    className={selectClasses}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedState}
                >
                    <option value="">
                        {selectedState ? "Select City" : "Select a State first"}
                    </option>
                    {filteredCities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
