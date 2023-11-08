import { useState } from "react";

import toast from "react-hot-toast";
import { api } from "~/utils/api";
import Image from "next/image";

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


export default function AwardList({
  awards = [],
  isEditMode
}: {
  isEditMode: boolean;
  
  awards:
    | { id: string; imageUrl: string; activityId: string | null }[]
    | undefined;
}) {
  const infoContext = api.useContext().example.getSingleActivity;
  const [activityId, setActivityId] = useState("");
  const deleteAward = api.example.deleteAward.useMutation({
    onSuccess: async () => {
      toast.success("Award deleted");
      await infoContext.invalidate({ id: activityId });
    },
  });

 

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl  lg:max-w-7xl ">
        <div
          className={
            " grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
          }
        >
          {/* <AddNew setOpen={setOpen} text="Add new award" /> */}
          {awards &&
            awards.map((award) => (
              <div key={award.id} className="flex flex-col gap-y-3">
                <div  className="group relative">
                  <div className="aspect-h-1 aspect-w-1 lg:aspect-none w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-48">
                    {!award.imageUrl.includes(".pdf") ? (
                      <Image
                        src={award.imageUrl}
                        alt={award.id}
                        width={500}
                        height={500}
                        className="h-full w-full object-contain object-center lg:h-full lg:w-full"
                      />
                    ) : (
                      <object
                        data={award.imageUrl}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                      >
                        <p>
                          Unable to display PDF file.{" "}
                          <a href={award.imageUrl}>Download</a> instead.
                        </p>
                      </object>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <a href={award.imageUrl}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          Click to open
                        </a>
                      </h3>
                    </div>
                  </div>
                </div>
               {isEditMode && <button
                  onClick={() => {
                    setActivityId(award.activityId!);
                    deleteAward.mutate({ awardId: award.id });
                  }}
                  className="inline-flex  justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Delete award
                </button>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
