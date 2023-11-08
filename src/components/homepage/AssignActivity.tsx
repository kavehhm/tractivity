import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { BsTrashFill } from "react-icons/bs";
import { api } from "~/utils/api";

const AssignActivity = ({
  activityId,
  setOpen,
  deleteEnabled = false
}: {
  deleteEnabled: boolean;
  activityId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const user = useUser();
  const sets = api.example.getAllActivitySets.useQuery(
    user.isLoaded && user.isSignedIn ? user.user?.id : "",
  );
  const activity = api.example.getSingleActivity.useQuery({ id: activityId });
  const addToSets = api.example.addActivityToSets.useMutation({
    onSuccess: async () => {
      toast.success("Activity assigned");
      await activity.refetch();
      setOpen(false);
    },
  });

 


  const allActivityContext = api.useContext().example


  const removeFromSets = api.example.removeActivityFromSets.useMutation({
    onSuccess: async () => {
      toast.success("Activity unassigned");
      await activity.refetch();
      setOpen(false);
    },
  });

  const deleteActivity = api.example.deleteSingleActivity.useMutation({
    onSuccess: async () => {
      toast.success("Activity deleted");
      
      setOpen(false)
       await allActivityContext.invalidate()



        // await allsetActivityContext.invalidate({
        //   activitySetId: activitySetId as string,
        //   userId: user.user?.id,
        // });
      



      
        // await allActivityContext.invalidate({
        //   userId: user.user?.id,
        // });
  
        
  
        // await allUnsetactivityContext.invalidate({
        //   userId: user.user?.id,
        // });

      
      setOpen(false);
    },
  });

  const [addArr, setAddArr] = useState<string[]>([]);
  const [removeArr, setRemoveArr] = useState<string[]>([]);
  const [checkedCount, setCheckedCount] = useState<number>(
    activity.data?.ActivitySet.length as number,
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
      addToSets.mutate({
        activityId,
        activitySets: addArr,
      });
    }

    if (removeArr.length > 0) {
      removeFromSets.mutate({
        activityId,
        activitySets: removeArr,
      });
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        {activity.isFetchedAfterMount ? (
          <p className=" text-lg font-bold">
            Assign{" "}
            <span className="underline underline-offset-4">
              {" "}
              {activity.data?.name}{" "}
            </span>{" "}
            to activity sets
          </p>
        ) : (
          <LoaderIcon style={{ width: "30px", height: "30px" }} />
        )}

{
  deleteEnabled && <BsTrashFill
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
/>
}
        
      </div>
      {sets.data && sets.data.length > 0 ? (
        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
          {sets.data?.map((set) => (
            <div key={set.id} className="flex gap-x-3">
              {activity.data?.ActivitySet?.some((obj) =>
                obj.activitySetId.includes(set.id),
              ) ? (
                //if it includes
                <input
                  defaultChecked
                  onChange={handleRemoveChange}
                  type={"checkbox"}
                  id={set.id}
                  name={set.id}
                  value={set.id}
                />
              ) : (
                // if it doesnt include
                <input
                  onChange={handleAddChange}
                  type={"checkbox"}
                  id={set.id}
                  name={set.id}
                  value={set.id}
                />
              )}

              <label htmlFor={set.id}>{set.name}</label>
            </div>
          ))}

        
          <button
            disabled={
              checkedCount === 0 ||
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

export default AssignActivity;
