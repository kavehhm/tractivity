// @ts-nocheck
import React, { useState } from "react";
import AwardList from "./AwardList";

import Datepicker from "react-tailwindcss-datepicker";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import UploadComponent from "./uploadButton";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { useUploadThing } from "~/utils/uploadthingHelpers";

const UpdateActivity = ({
  data,
  refetch,
  setEditModeActive,
  awards,
}: {
  data:
    | {
        id: string;
        creatorId: string;
        name: string;
        startDate: Date | null;
        endDate: Date | null;
        imageUrl: string | null;
        description: string | null;
        Reflection: string | null;
        createdAt: Date;
        updatedAt: Date;
        hoursPerWeek: number | null;
        stillActive: boolean;
      }
    | null
    | undefined;
  refetch: any;
  awards:
    | { id: string; imageUrl: string; activityId: string | null }[]
    | undefined;
  setEditModeActive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState(data?.name ?? "");

  const [description, setDescription] = useState(data?.description ?? "");
  const [reflection, setReflection] = useState(data?.Reflection ?? "");
  const [dates, setDates] = useState({
    startDate: data?.startDate ?? undefined,
    endDate: data?.endDate ?? undefined,
  });
  const [hours, setHours] = useState(data?.hoursPerWeek ?? 0);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [stillActive, setStillActive] = useState(data?.stillActive ?? false);

  const infoContext = api.useContext().example.getSingleActivity;

  const createImage = api.example.createImage.useMutation({
    onSuccess: () => infoContext.invalidate({ id: data?.id }),
  });
  const [files, setFiles] = useState<string[]>([]);
  const [filesObj, setFileObj] = useState<File[]>([]);
  const [deletedFile, setDeletedFile] = useState<string>();

  const user = useUser();
  const handleValueChange = (
    newValue: React.SetStateAction<{ startDate: string; endDate: string }>,
  ) => {
    const startDay = newValue.startDate
      ? new Date(Date.parse(newValue.startDate as string))
      : undefined;
    if (startDay) {
      startDay.setDate(startDay.getDate() + 1);
    }

    const endDay = newValue.endDate
      ? new Date(Date.parse(newValue.endDate as string))
      : undefined;
    if (endDay) {
      endDay.setDate(endDay.getDate() + 1);
    }
    setDates({ startDate: startDay, endDate: endDay });
  };

  const deleteFiles = api.example.deleteFiles.useMutation();

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res) {
        const filesArr: string[] = [];
        res.map((file) => filesArr.push(file.url));
        setFiles((prev) => [...filesArr, ...prev]);
      }
      toast.success("File uploaded!");
      setFileUploadLoading(false);
      console.log("Files: ", res);
    },
    onUploadError: (error: Error) => {
      setFileUploadLoading(false);

      alert(`ERROR! ${error.message}`);
    },
    onUploadBegin: () => {
      setFileUploadLoading(true);
    },
  });

  const updateActivity = api.example.updateActivity.useMutation({
    onSuccess: async () => {
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (files[i]!.trim().length > 1 && data?.id) {
            createImage.mutate({
              activityId: data?.id,
              imageUrl: files[i]!,
            });
          }
        }
      }
      toast.success("Activity updated");
      await refetch();
      setEditModeActive(false);
    },
  });

  const deleteFile = api.example.deleteFile.useMutation({
    onSuccess: () =>
      setFiles((prev) => prev.filter((file) => file !== deletedFile)),
  });
  return (
    <div className="flex flex-col gap-y-16">
      <div className="flex items-center gap-x-4">
        <button
          className="  inline-flex w-10 justify-center rounded-md bg-red-600 px-3 py-2.5 text-sm  text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onClick={() => {
            setEditModeActive(false);

            if (files.length > 0) {
              deleteFiles.mutate(files);
            }
          }}
        >
          <RxCross1 />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-2xl font-bold text-gray-900">Name</label>

        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="rounded-md  border-2 bg-white px-4 py-2 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-2xl font-bold text-gray-900">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-md  border-2 bg-white px-4 py-2 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
        />
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-gray-900">Duration</h1>
        <div className="flex items-center gap-x-2 text-gray-800">
          <input
            defaultChecked={stillActive}
            onChange={(val) => {
              if (val.target.checked) {
                setStillActive(true);
              } else {
                setStillActive(false);
              }
            }}
            type="checkbox"
          />{" "}
          <label>Still active?</label>
        </div>
        <div className="w-64 z-50 rounded-md border-2">
          <Datepicker
            primaryColor={"purple"}
            maxDate={new Date()}
            value={dates}
            popoverDirection="down"
            
            classNames={'z-50'}
            startFrom={
              new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                new Date().getDate(),
              )
            }
            asSingle={stillActive}
            onChange={handleValueChange}
            showShortcuts={false}
            placeholder="Select date range"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-2xl font-bold text-gray-900">
          Hours per week
        </label>
        <input
          value={hours}
          type="number"
          min={0}
          max={168}
          onChange={(e) => setHours(parseInt(e.target.value))}
          className="rounded-md  border-2 bg-white px-4 py-2 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
        />
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Awards / Certificates
        </h1>
        <UploadComponent
          filesObj={filesObj}
          setFileObj={setFileObj}
          permittedFileInfo={permittedFileInfo}
          startUpload={startUpload}
        />
        {files.length > 0 && (
          <div className="w-full border-b-2 py-4">
            <p className="text-lg">Pending files</p>
          </div>
        )}
        <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {files.map((file) => (
            <div key={file}>
              {file.trim().length > 0 && (
                <div className="aspect-h-1 aspect-w-1 lg:aspect-none bg- w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-48">
                  {!file.includes(".pdf") ? (
                    <Image
                      alt="User uploaded image"
                      width={500}
                      height={500}
                      src={file}
                    />
                  ) : (
                    <object
                      data={file}
                      type="application/pdf"
                      width="100%"
                      height="300px"
                    >
                      <p>
                        Unable to display PDF file. <a href={file}>Download</a>{" "}
                        instead.
                      </p>
                    </object>
                  )}
                  <button
                    onClick={() => {
                      setDeletedFile(file);
                      deleteFile.mutate(file);
                    }}
                    className="mt-3 inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Delete award
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-full border-b-2 py-4">
          <p className="text-lg">Existing files</p>
        </div>
        <AwardList awards={awards} isEditMode={true} />
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-gray-900">Reflections</h1>
        <div className="flex flex-col gap-3 ">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="rounded-md  border-2 bg-white px-4 py-2 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
          />
        </div>

        {user.isLoaded && user.isSignedIn && (
          <button
            disabled={fileUploadLoading || updateActivity.isLoading}
            className="mt-6 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-500"
            onClick={async () => {
              if (filesObj.length > 0) {
                await startUpload(filesObj);
              }
              if (data?.id) {
                updateActivity.mutate({
                  id: data?.id,
                  startDate: dates.startDate
                    ? new Date(Date.parse(dates.startDate as string))
                    : undefined,
                  endDate: dates.endDate
                    ? new Date(Date.parse(dates.endDate as string))
                    : undefined,
                  description,
                  name,
                  reflection,
                  creatorId: user.user.id,
                  hoursPerWeek: hours,
                  stillActive,
                });
              }
            }}
          >
            Update activity
          </button>
        )}
      </div>
    </div>
  );
};

export default UpdateActivity;

//data?.startDate == typeof new Date() ? dates.startDate as Date :
//typeof data?.endDate == typeof new Date() ? dates.endDate as Date :
