import { useState } from "react";
import  { LoaderIcon } from "react-hot-toast";
import { api } from "~/utils/api";
import ActivityComponent from "./Activity";
import AddNew from "./AddNew";
import AssignActivity from "./AssignActivity";
import CreateModal from "./CreateModal";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/

export default function ActivityList({
  setOpen,
  userId,
  activitySet = "",
  modeIsAllTotal = "set",
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  activitySet: string;
  modeIsAllTotal: string;
}) {
  let activities;

  if (modeIsAllTotal === "set") {
    activities = api.example.getAllActivitiesInSet.useQuery({
      userId,
      activitySetId: activitySet,
    });
  } else if (modeIsAllTotal === "unset") {
    activities = api.example.getAllUnsetActivities.useQuery({
      userId,
    });
  } else {
    activities = api.example.getAllActivities.useQuery({
      userId,
    });
  }

  const [assignOpen, setAssignOpen] = useState(false);
  const [chosenId, setChosenId] = useState("");

  const handleOpen = (item: string) => {
    setChosenId(item);
    setAssignOpen(true);
  };

  return (
    <div className="bg-white">
      <CreateModal open={assignOpen} setOpen={setAssignOpen}>
        <AssignActivity deleteEnabled={true} setOpen={setAssignOpen} activityId={chosenId} />
      </CreateModal>
      <div className="mx-auto max-w-2xl  sm:py-8 lg:max-w-7xl ">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          <AddNew type="activity" setOpen={setOpen} text="Create new activity" />
          {activities.isLoading && (
            <div>
              <LoaderIcon />
            </div>
          )}
          {activities &&
            activities.data?.map((activity) => (
              <ActivityComponent key={activity.id} activitySet={activitySet} handleOpen={handleOpen} activity={activity}  />
            ))}
        </div>
      </div>
    </div>
  );
}
