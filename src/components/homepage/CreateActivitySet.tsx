import React, { useState } from "react";

import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";


const CreateActivitySet = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  

  const user = useUser();
  

  const activityContext = api.useContext().example.getAllActivitySets;

  const createActivitySet = api.example.createActivitySet.useMutation({
    onSuccess: async ()=> {toast.success("Activity set created!");
  await activityContext.invalidate( user.user?.id );
  setOpen(false)
  }
  })

 


  

  return (
    <div className="mx-auto flex max-w-7xl  flex-col gap-y-16 px-2 py-6 sm:px-6 lg:px-8">
      <p className="-mb-8 text-center text-lg font-bold">
        Create your activity
      </p>

      <div className="flex flex-col gap-3">
        <label className="text-lg font-bold text-gray-900">Name <span className="text-red-500">*</span></label>

        <input
          onChange={(e) => setName(e.target.value)}
          placeholder="Example: (College apps, job apps)"
          className="rounded-md  border-2 bg-white px-4 py-2 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-lg font-bold text-gray-900">Description</label>
        <p className="text-xs text-gray-600">
          {description.length} / 50
        </p>
        <textarea
        maxLength={50}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-md  border-2 bg-white px-4 py-2 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
        />
      </div>

     
      
      
      
      {user.isLoaded && user.isSignedIn && (
        <button
          className="-mt-8 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-500"
          disabled={name.length < 1}
          onClick={ () => {
            try {
               createActivitySet.mutate({
                creatorId: user.user.id,
                name,
                description
              });
            } catch (error) {
              toast.error("Error creating activity");
            }
          }}
        >
          Create activity set
        </button>
      )}
    </div>
  );
};

export default CreateActivitySet;
