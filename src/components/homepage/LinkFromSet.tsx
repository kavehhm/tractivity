import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { api } from "~/utils/api";

const LinkFromSet = ({
  activitySetId,
  setOpen,
}: {
  activitySetId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const user = useUser();
  const activities = api.example.getAllActivities.useQuery({
    userId: user.isLoaded && user.isSignedIn ? user.user?.id : "",
  });
  const set = api.example.getActivitySet.useQuery(activitySetId);
  const allActivityContext = api.useContext().example;

  const addToSet = api.example.addActivitiesToSet.useMutation({
    onSuccess: async () => {
      toast.success("Activity assigned");
      await allActivityContext.invalidate()

      setOpen(false);
    },
  });


  const removeFromSet = api.example.removeActivitiesFromSet.useMutation({
    onSuccess: async () => {
      toast.success("Activity unassigned");
      await allActivityContext.invalidate()
      setOpen(false);
    },
  });

  

  const [addArr, setAddArr] = useState<string[]>([]);
  const [removeArr, setRemoveArr] = useState<string[]>([]);
  const [checkedCount, setCheckedCount] = useState<number>(
    set.data?.activityList.length as number,
  );

  // current checked ones, when unchecked, add to an array of items that will be unlinked, compare to original array

  // current unchecked ones, when checked add to an array of items that will be linked

  const handleAddChange = (e: {
    target: { checked: boolean; value: any; name: any };
  }) => {
    // to find out if it's checked or not; returns true or false
    const checked = e.target.checked;

    if (checked) {
      setAddArr((prev) => [e.target.value, ...prev]);
      setCheckedCount((prevCount) => prevCount + 1);
    } else {
      setAddArr((prev) => prev.filter((set) => set !== e.target.value));
      setCheckedCount((prevCount) => prevCount - 1);
    }
  };
  const handleRemoveChange = (e: {
    target: { checked: boolean; value: any; name: any };
  }) => {
    // to find out if it's checked or not; returns true or false
    const checked = e.target.checked;

    if (!checked) {
      setRemoveArr((prev) => [e.target.value, ...prev]);
      setCheckedCount((prevCount) => prevCount - 1);
    } else {
      setRemoveArr((prev) => prev.filter((set) => set !== e.target.value));
      setCheckedCount((prevCount) => prevCount + 1);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (addArr.length > 0) {
      addToSet.mutate({
        activitySetId,
        activities: addArr,
      });
    }

    if (removeArr.length > 0) {
      removeFromSet.mutate({
        activitySetId,
        activities: removeArr,
      });
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        {set.isFetchedAfterMount ? (
          <p className=" text-lg font-bold">
            Assign activities to {' '}
            <span className="underline underline-offset-4">
              
              {set.data?.name}
            </span>{" "}
          </p>
        ) : (
          <LoaderIcon style={{ width: "30px", height: "30px" }} />
        )}

        {/* <BsTrashFill
          onClick={() => {
            if (activity && activity.data?.creatorId === user.user?.id) {
              deleteActivity.mutate({
                id: activityId,
              });
            } else {
              toast.error("Failed to delete");
            }
          }}
          className="transform cursor-pointer text-2xl text-red-600 transition hover:scale-105 active:scale-95"
        /> */}
      </div>
      {activities.data && activities.data.length > 0 ? (
        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
          {activities.data?.map((activity) => (
            <div key={activity.id} className="flex gap-x-3">
              {set.data?.activityList?.some((obj) =>
                obj.activity.id.includes(activity.id),
              ) ? (
                //if it includes
                <input
                  defaultChecked
                  onChange={handleRemoveChange}
                  type={"checkbox"}
                  id={activity.id}
                  name={activity.id}
                  value={activity.id}
                />
              ) : (
                // if it doesnt include
                <input
                  onChange={handleAddChange}
                  type={"checkbox"}
                  id={activity.id}
                  name={activity.id}
                  value={activity.id}
                />
              )}

              <label htmlFor={activity.id}>{activity.name}</label>
            </div>
          ))}

          <button
            disabled={
             
              (addArr.length === 0 && removeArr.length === 0)
            }
            className="mt-3  inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-500"
            type="submit"
          >
            Assign
          </button>
        </form>
      ) : (
        "No activity sets"
      )}
    </div>
  );
};

export default LinkFromSet;
