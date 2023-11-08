"use client";
import { useUser } from "@clerk/nextjs";


import React, { useState } from "react";
import ActivityList from "~/components/homepage/ActivityList";
import CreateActivity from "~/components/homepage/CreateActivity";
import CreateModal from "~/components/homepage/CreateModal";


const AllActivitiesPage = () => {
  const user = useUser();

  const [open, setOpen] = useState(false);

 

  return (
    <div className="mx-auto flex max-w-7xl   flex-col px-2 py-24 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-xl text-gray-900">
        Hello, {user.isSignedIn && user.user?.firstName}
      </h1>

      <p className="text-lg text-gray-900 font-bold">
        All of your activities
      </p>


      <div className="text-2xl font-bold text-gray-900">
        <CreateModal open={open} setOpen={setOpen}>
          <CreateActivity activitySet={''} setOpen={setOpen} />
        </CreateModal>
        

        <ActivityList
        modeIsAllTotal={'all'}
          activitySet={''}
          userId={user.isSignedIn ? user.user?.id : ""}
          setOpen={setOpen}
        />
      </div>
    </div>
  );
};

export default AllActivitiesPage;
