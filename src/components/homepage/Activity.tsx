import React from "react";

type activityType = {
    activity: {
  id: string;
  creatorId: string;
  name: string;
  stillActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  imageUrl: string | null;
  description: string | null;
  Reflection: string | null;
  createdAt: Date;
  updatedAt: Date;
  hoursPerWeek: number | null;
    };

    activitySet: string;

    handleOpen: (item: string) => void
};
const ActivityComponent = ({ activity, activitySet, handleOpen }: activityType) => {
  return (
    <div key={activity.id} className="flex flex-col">
      <div className="group relative  min-h-[12rem] rounded-lg border-2 border-gray-300 p-6">
        {/* <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={activity.imageUrl ?? ''}
                    alt={activity.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div> */}

        <div className=" flex  h-full flex-col justify-between">
          <div className="flex place-items-center items-center justify-between">
            <h3 className="text-base text-gray-700 group-hover:underline">
              <a
                href={`/dashboard/${
                  activitySet.length > 0 ? activitySet : "activity"
                }/${activity.id}`}
              >
                <span aria-hidden="true" className="absolute inset-0" />
                {activity.name}
              </a>
            </h3>
            <p
              onClick={() => handleOpen(activity.id)}
              className="z-40 -mt-3 cursor-pointer font-normal text-gray-600 transition hover:scale-110 active:scale-95"
            >
              ...
            </p>
          </div>
          <p className="mt-1  truncate text-sm text-gray-500">
            {activity.startDate ? `${activity.startDate?.toLocaleDateString()} to ` :  "No dates"}
            {activity.stillActive
              ? "Present"
              : activity.endDate?.toLocaleDateString()}{" "}
          </p>
          <p className="mt-1  truncate text-sm text-gray-500">
            {activity.description && activity.description.length > 0
              ? activity.description
              : "No description"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityComponent;
