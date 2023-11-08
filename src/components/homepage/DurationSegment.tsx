// @ts-nocheck
import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const DurationSegment = () => {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleValueChange = (
    newValue
  ) => {
    setValue(newValue);
  };
  return (
    <div className="flex gap-x-4 items-center">
      <div className="w-64 border-2 rounded-md">
        <Datepicker
          primaryColor={"purple"}
          value={value}
          onChange={handleValueChange}
          showShortcuts={true}
          placeholder="Select date range"
        />
      </div>

      <input min={'1'} max='168' className="bg-white w-64 border-2 rounded-md placeholder:text-sm py-2 placeholder:text-gray-400 placeholder:font-light px-4" placeholder="Hours per week" type={"number"} />

      <p>Hours worked: 0</p>
    </div>
  );
};

export default DurationSegment;
