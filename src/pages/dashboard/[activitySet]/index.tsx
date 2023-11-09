import {  useUser } from "@clerk/nextjs";

import { useRouter } from "next/router";

import React, { useState } from "react";
import ActivityList from "~/components/homepage/ActivityList";
import CreateActivity from "~/components/homepage/CreateActivity";
import CreateModal from "~/components/homepage/CreateModal";
import { api } from "~/utils/api";
import { BsFillTrashFill } from "react-icons/bs";
import toast from "react-hot-toast";
import LinkFromSet from "~/components/homepage/LinkFromSet";
import { BiSolidEdit } from "react-icons/bi";

const ActivitySetPage = () => {
  const user = useUser();

  const [open, setOpen] = useState(false);
  const [openAssn, setOpenAssn] = useState(false)

  const router = useRouter();
  const activitySetId = router.query.activitySet as string;
  const activitySet = api.example.getActivitySet.useQuery(activitySetId);
  const deleteSet = api.example.deleteActivitySet.useMutation({
    onSuccess: async () => {
      toast.success("Activity set deleted");
      await router.replace(`/dashboard`);
    },
  });

  return (
    <div className="mx-auto flex max-w-7xl   flex-col px-2 py-24 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-xl text-gray-900">
        Hello, {user.isSignedIn && user.user?.firstName}
      </h1>

     

      <div className="text-2xl font-bold text-gray-900">
        <CreateModal open={open} setOpen={setOpen}>
          <CreateActivity activitySet={activitySetId} setOpen={setOpen} />
        </CreateModal>
        <CreateModal open={openAssn} setOpen={setOpenAssn}>
          <LinkFromSet activitySetId={activitySetId} setOpen={setOpenAssn} />
        </CreateModal>
        <h2 className="flex  items-center gap-x-3 text-2xl font-bold tracking-tight text-gray-900">
          {activitySet.isFetchedAfterMount && activitySet.data?.name} Activities
          <BsFillTrashFill
            onClick={() => deleteSet.mutate(activitySetId)}
            className="transform cursor-pointer text-red-600 transition hover:scale-105 active:scale-95"
          />
          <BiSolidEdit
                    onClick={() => setOpenAssn(true)}
                    className="transform cursor-pointer text-2xl text-indigo-600 transition hover:scale-105 active:scale-95"
                  />
        </h2>
        
          <p className="text-gray-600 truncate w-full whitespace-break-spaces mt-2 font-normal text-base">{activitySet.isFetchedAfterMount && activitySet.data?.description}</p>
        
        


        <ActivityList
        modeIsAllTotal={'set'}
          activitySet={activitySetId}
          userId={user.isSignedIn ? user.user?.id : ""}
          setOpen={setOpen}
        />
      </div>
    </div>
  );
};

export default ActivitySetPage;
