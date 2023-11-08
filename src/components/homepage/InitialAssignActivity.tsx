import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { api } from "~/utils/api";

const InitialAssignActivity = ({
  activitySetId,
  setSetArr,
  setCheckedCount
}: {
  activitySetId: string;
  setSetArr: React.Dispatch<React.SetStateAction<string[]>>;
  setCheckedCount: React.Dispatch<React.SetStateAction<number>>
}) => {
  const user = useUser();


  const sets = api.example.getAllActivitySets.useQuery(
    user.isLoaded && user.isSignedIn ? user.user?.id : "",
  );
  useEffect(() => {
    // Calculate the initial checked count based on the defaultChecked items
    const initialCheckedCount = sets.data?.filter((set) => set.id === activitySetId).length ?? 0;
    setCheckedCount(initialCheckedCount);
  }, [activitySetId, sets.data, setCheckedCount]);
 

  const handleAddChange = (e: {
    target: { checked: boolean; value: any; name: any };
  }) => {
    // to find out if it's checked or not; returns true or false
    const checked = e.target.checked;

    if (checked) {
      setSetArr((prev) => [e.target.value, ...prev]);
      setCheckedCount((prevCount) => prevCount + 1);
    } else {
      setSetArr((prev) => prev.filter((set) => set !== e.target.value));
      setCheckedCount((prevCount) => prevCount - 1);
    }
  };

 


  return (
    <div>
      {sets.data?.map((set) => (
        <div key={set.id} className="flex gap-x-3">
        
            <input
              defaultChecked={set.id === activitySetId}
              onChange={handleAddChange}
              type={"checkbox"}
              id={set.id}
              name={set.id}
              value={set.id}
            />
         
          

          <label htmlFor={set.id}>{set.name}</label>
        </div>
      ))}

        {sets.data?.length === 0 && "You have no activity sets"}
    </div>
  );
};

export default InitialAssignActivity;
