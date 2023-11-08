import Link from "next/link";
import React from "react";
import { LoaderIcon } from "react-hot-toast";

const ActivitySet = ({
  set,
  setArr
}: {
  set: {
    id: string;
    name: string;
    description: string;
  };
  setArr: { activity: { name: string; id: string; }; }[]

}) => {
  // const activitySet = api.example.getActivitySet.useQuery(set.id);

  return (
    <div
      key={set.id}
      className="group relative z-10 flex min-h-[20rem] flex-col gap-y-8 rounded-lg  border-2 border-gray-300 p-12"
    >
      {/* <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={set.imageUrl ?? ''}
                    alt={set.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div> */}
      <div className="mt-4 flex justify-between">
        <div className="w-full">
          <h3 className="text-xl text-gray-700 group-hover:underline">
            <a href={`/dashboard/${set.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {set.name}
            </a>
          </h3>
          <p className="mt-1  truncate text-sm text-gray-500">
            {set.description}
          </p>
        </div>
      </div>
      <div className="z-50 flex flex-col gap-y-3">
        <p className="mb-1 text-base font-semibold underline">Activities</p>
        {setArr ? (
          setArr.slice(0, 3).map((activity) => (
            <Link
              href={`/dashboard/${set.id}/${activity.activity.id}`}
              className="text-sm font-normal text-gray-500 hover:underline"
              key={activity.activity.id}
            >
              {activity.activity.name}
            </Link>
          ))
        ) : (
          <LoaderIcon />
        )}

        {setArr &&
          
          setArr.length > 3 &&
          <p className="text-xs font-normal text-gray-400">
            +{setArr.length - 3} more
          </p>
          }
      </div>
    </div>
  );
};

export default ActivitySet;
