import  { LoaderIcon } from "react-hot-toast";
import { api } from "~/utils/api";
import ActivitySet from "./ActivitySet";
import AddNew from "./AddNew"

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

  
  export default function ActivitySList({setOpen, userId}: {setOpen:React.Dispatch<React.SetStateAction<boolean>>; userId: string}) {
    const activities = api.example.getAllActivitySets.useQuery(userId)
   
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl  sm:py-8 lg:max-w-7xl ">
  
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2  xl:gap-x-8">
            <AddNew type="set" setOpen={setOpen} text="Create new activity set" />
            {activities.isLoading && <div><LoaderIcon /></div>}
            {activities && activities.data?.map((set) => (
              <ActivitySet key={set.id} setArr={set.activityList} set={set} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  