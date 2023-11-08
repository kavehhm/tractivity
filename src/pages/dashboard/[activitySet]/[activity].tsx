import AwardList from "~/components/homepage/AwardList";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import toast, { LoaderIcon } from "react-hot-toast";
import UpdateActivity from "~/components/homepage/UpdateActivity";
import CreateModal from "~/components/homepage/CreateModal";
import AssignActivity from "~/components/homepage/AssignActivity";
import { BsFillTrashFill } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const ActivityPage = () => {
  const [open, setOpen] = useState(false);

  const [editModeActive, setEditModeActive] = useState(false);

  const [totalWeeks, setTotalWeeks] = useState(0);
  const router = useRouter();
  const user = useUser();

  const { activity, activitySet } = router.query;

  const singleActivity = api.example.getSingleActivity.useQuery({
    id: activity as string,
  });


  const awards = singleActivity.data?.awardImageURL;
  const deleteActivity = api.example.deleteSingleActivity.useMutation({
    onSuccess: async () => {
      toast.success("Activity deleted");
      await router.replace(
        `/dashboard/${activitySet ? (activity as string) : ``}`,
      );
    },
  });

  function diff_weeks(
    dt2: Date | null | undefined,
    dt1: Date | null | undefined,
  ) {
    let diff = (dt2!.getTime() - dt1!.getTime()) / 1000;
    diff /= 60 * 60 * 24 * 7;
    return Math.abs(Math.round(diff));
  }

  useEffect(() => {
    if (singleActivity.isFetchedAfterMount && singleActivity.data?.startDate) {
      if (singleActivity.data?.stillActive) {
        setTotalWeeks(diff_weeks(singleActivity.data.startDate, new Date()));
      } else {
        setTotalWeeks(
          diff_weeks(
            singleActivity.data?.endDate,
            singleActivity.data?.startDate,
          ),
        );
      }
    }
  }, [singleActivity]);

  if (singleActivity.isLoading) {
    return (
      <div>
        <LoaderIcon />
      </div>
    );
  }

  if (singleActivity.isFetched && !editModeActive) {
    return (
      <div className="mx-auto flex max-w-7xl  flex-col gap-y-16 px-2 py-24 sm:px-6 lg:px-8">
        <CreateModal open={open} setOpen={setOpen}>
          <AssignActivity deleteEnabled={false} setOpen={setOpen} activityId={activity as string} />
        </CreateModal>
        {/* <div className="z-20 flex justify-end gap-x-4 ">
          <button
            className=" w-64 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setEditModeActive(true)}
          >
            Edit activity
          </button>
          {activity && (
            <button
              className=" w-64 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              onClick={() =>
                deleteActivity.mutate({
                  id: activity as string,
                  activitySetId: activitySet as string,
                })
              }
            >
              Delete activity
            </button>
          )}
        </div> */}
        <div className="md:grid grid-cols-3   ">
          <div className="col-span-2 flex flex-col gap-5 gap-y-16">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-x-3">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  {singleActivity.data?.name}
                </h1>
                {activity && (
                  <BiSolidEdit
                    onClick={() => setEditModeActive(true)}
                    className="transform cursor-pointer text-2xl text-indigo-600 transition hover:scale-105 active:scale-95"
                  />
                )}
                {activity && (
                  <BsFillTrashFill
                    onClick={() => {
                      if (singleActivity.data?.creatorId === user.user?.id) {
                        deleteActivity.mutate({
                          id: activity as string,
                        });
                      }
                    }}
                    className="transform cursor-pointer text-2xl text-red-600 transition hover:scale-105 active:scale-95"
                  />
                )}
              </div>
              <p className="text-gray-600">
                {singleActivity.data?.description &&
                singleActivity.data.description.length > 0
                  ? singleActivity.data?.description
                  : "No description"}
              </p>
            </div>
            <div className="flex flex-col gap-5 text-gray-600">
              <h1 className="text-2xl font-bold text-gray-900">Duration</h1>
              {singleActivity.data?.startDate
                ? `${singleActivity.data?.startDate?.toDateString()} to `
                : "No dates"}
              {singleActivity.data?.stillActive
                ? "Present"
                : singleActivity.data?.endDate?.toDateString()}{" "}
              <p>
                {singleActivity.data?.hoursPerWeek
                  ? `${singleActivity.data?.hoursPerWeek} ${
                      singleActivity.data.hoursPerWeek != 1 ? `hours` : `hour`
                    } per week, ${totalWeeks} ${
                      totalWeeks != 1 ? `weeks` : `week`
                    }, and   ${
                      singleActivity.data.hoursPerWeek * totalWeeks
                    } total ${
                      singleActivity.data.hoursPerWeek * totalWeeks != 1
                        ? `hours`
                        : `hour`
                    }`
                  : "No hours"}{" "}
              </p>
            </div>

            <div className="flex flex-col gap-5 text-gray-600">
              <h1 className="text-2xl font-bold text-gray-900">
                Awards / Certificates
              </h1>
              {singleActivity.data?.awardImageURL &&
              singleActivity.data.awardImageURL.length > 0 ? (
                <AwardList awards={awards} isEditMode={false} />
              ) : (
                "No documents"
              )}
            </div>
            <div className="flex flex-col gap-5">
              <h1 className="text-2xl font-bold text-gray-900">Reflections</h1>
              <div className=" w-3/4 text-gray-600">
                {singleActivity.data?.Reflection &&
                singleActivity.data.Reflection.length > 0
                  ? singleActivity.data.Reflection
                  : "No reflection"}
              </div>
            </div>
          </div>
          <div className="cols-span-1 mt-16 md:mt-0">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-x-3">
                <h1 className="text-2xl font-bold text-gray-900 underline underline-offset-4">
                  Linked sets
                </h1>
                {activity && (
                  <BiSolidEdit
                    onClick={() => setOpen(true)}
                    className="transform cursor-pointer text-2xl text-indigo-600 transition hover:scale-105 active:scale-95"
                  />
                )}
              </div>
              {singleActivity.data?.ActivitySet &&
              singleActivity.data?.ActivitySet.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {singleActivity.data?.ActivitySet.map((set) => (
                    <Link
                      key={set.activityId}
                      href={`/dashboard/${set.activitySet.id}`}
                      className={`${
                        set.activitySetId === activitySet &&
                        `underline underline-offset-4`
                      }  hover:text-indigo-600`}
                    >
                      {set.activitySet.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p>No sets linked</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (editModeActive) {
    return (
      <div className="mx-auto flex max-w-7xl  flex-col gap-y-16 px-2 py-24 sm:px-6 lg:px-8">
        <UpdateActivity
          awards={awards}
          setEditModeActive={setEditModeActive}
          refetch={singleActivity.refetch}
          data={singleActivity.data}
        />
      </div>
    );
  }
};

export default ActivityPage;

//a2f3c7b9-de9e-45d9-9af1-50db1ffddcdc
//638d3a3d-cd7e-49af-932c-e06e7e3585d4
//ec7545ac-0d41-4164-822a-adbca9eaa541
