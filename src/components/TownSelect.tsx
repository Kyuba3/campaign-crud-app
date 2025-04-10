import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

const cities = ["Warsaw", "Krakow", "Gdansk", "Wroclaw"];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TownSelect = ({ value, onChange }: Props) => {
  return (
    <div className="form-group">
      <label>Town *</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button className="w-full rounded border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {value || "Select City"}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
            {cities.map((city) => (
              <Listbox.Option
                key={city}
                value={city}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-emerald-100 text-emerald-900" : "text-gray-900"
                  }`
                }
              >
                {city}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};
