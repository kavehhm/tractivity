import { useUser } from "@clerk/nextjs";

import Link from "next/link";

import React, { useState } from "react";
import ActivitySetList from "~/components/homepage/ActivitySetList";
import CreateActivitySet from "~/components/homepage/CreateActivitySet";
import CreateModal from "~/components/homepage/CreateModal";
import { api } from "~/utils/api";

const DashboardPage = () => {
  const user = useUser();

  const [open, setOpen] = useState(false);
  const userData = api.example.getUserData.useQuery()

  return (
    <div className="mx-auto flex max-w-7xl   flex-col px-2 py-24 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-start md:items-center gap-3 gap-x-6 md:!flex-row">
        <h1 className=" text-xl text-gray-900">
          Hello, {user.isSignedIn && user.user?.firstName}
        </h1>
        


<div className="h-full flex-col  flex gap-3 ">
          <Link
            className="text-md   w-min  whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2.5 font-bold tracking-tight text-white hover:bg-indigo-700 "
            href={"/dashboard/activities"}
          >
            View all your activities
          </Link>
          <Link
            className="text-md  w-min   whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2.5 font-bold tracking-tight text-white hover:bg-indigo-700 "
            href={"/dashboard/unassigned-activities"}
          >
            View your unassigned activities
          </Link>
          </div>
      </div>

      <p className="mb-12 text-lg">
          You have used <span className="font-bold"> {(userData && userData.isFetchedAfterMount && userData.data?.uploads) ? userData.data?.uploads : 0}  / 100</span> file uploads
        </p>

      <div className="text-2xl font-bold text-gray-900">
        <CreateModal open={open} setOpen={setOpen}>
          <CreateActivitySet setOpen={setOpen} />
        </CreateModal>
        <h2 className="text-2xl  font-bold tracking-tight text-gray-900">
          Activity Sets
        </h2>

        <ActivitySetList
          userId={user.isSignedIn ? user.user?.id : ""}
          setOpen={setOpen}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
