import { nation, nations } from '@/app/home/_types/homeTypes';

const renderContinents = (
  data: nations[],
  handleTempSelect: (continent: string, country: string, city: string) => void,
  crntNation: nation | null | undefined,
) => {
  return data.map((continent, idx) => (
    <div key={idx} className="grid gap-2 mb-9">
      <h3 className="text-[#44484c] text-lg font-bold leading-[28.80px] md:text-xl md:font-semibold">
        {continent.continent}
      </h3>
      <div className="flex gap-[7px] flex-wrap">
        {continent.countries.map((country) =>
          country.cities.map((city, cityIndex) => (
            <button
              key={cityIndex}
              onClick={(e) => {
                e.preventDefault();
                handleTempSelect(continent.continent, country.name, city);
              }}
              className={`h-7 px-3 py-[7px] rounded-[100px] border justify-center items-center inline-flex text-center text-xs font-medium md:text-base md:h-9 ${
                JSON.stringify(crntNation) ===
                `{"continent":"${continent.continent}","country":"${country.name}","city":"${city}"}`
                  ? 'bg-[#f4f6f9] text-[#0582ff] border-[#0582ff]'
                  : 'bg-white text-[#797c80] border-[#dee1e5]'
              }`}
            >
              {city}
            </button>
          )),
        )}
      </div>
    </div>
  ));
};

export default renderContinents;
