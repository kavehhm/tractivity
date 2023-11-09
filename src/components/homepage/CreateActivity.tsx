// @ts-nocheck
import React, { useEffect, useState } from "react";

import Datepicker from "react-tailwindcss-datepicker";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import UploadComponent from "./uploadButton";
import InitialAssignActivity from "./InitialAssignActivity";
import { useUploadThing } from "~/utils/uploadthingHelpers";

const CreateActivity = ({
  setOpen,
  activitySet,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activitySet: string;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [reflection, setReflection] = useState("");
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [dates, setDates] = useState({
    startDate: undefined,
    endDate: undefined,
  });
  const [setArr, setSetArr] = useState<string[]>([]);
  const [checkedCount, setCheckedCount] = useState(0);
  const [hours, setHours] = useState(0);

  const [stillActive, setStillActive] = useState(false);

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

  const allActivityContext = api.useContext().example;

  useEffect(() => {
    if (activitySet && activitySet.length > 20 && setArr.length == 0) {
      setSetArr([activitySet]);
    }
  }, []);

  const createImage = api.example.createImage.useMutation();

  const [files, setFiles] = useState<string[]>([]);

  const [filesObj, setFileObj] = useState<File[]>([]);

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

  const createNewActivity = api.example.createActivity.useMutation({
    onSuccess: async (data) => {
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (files[i]!.trim().length > 1) {
            createImage.mutate({
              activityId: data,
              imageUrl: files[i]!,
            });
          }
        }
      }

      toast.success("Activity created");
      await allActivityContext.invalidate();

      setOpen(false);
    },
  });

  return (
    <div className="mx-auto flex max-w-7xl  flex-col gap-y-16 px-2 py-6 sm:px-6 lg:px-8">
      <p className="-mb-8 text-center text-lg font-bold">
        Create your activity
      </p>

      <div className="flex flex-col gap-3">
        <label className="text-lg font-bold text-gray-900">
          Name <span className="text-red-500">*</span>
        </label>

        <input
          onChange={(e) => setName(e.target.value)}
          className="rounded-md  border-2 bg-white px-4 py-2 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-lg font-bold text-gray-900">Description</label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-md  border-2 bg-white px-4 py-2 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-lg font-bold text-gray-900">
          Duration <span className="text-red-500">*</span>
        </h1>
        <div className="flex items-center gap-x-2 text-gray-800">
          <input
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
        <div className=" z-50 rounded-md border-2">
          <Datepicker
            classNames={"z-50"}
            popoverDirection="down"
            startFrom={
              new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                new Date().getDate(),
              )
            }
            primaryColor={"purple"}
            value={dates}
            maxDate={new Date()}
            asSingle={stillActive}
            onChange={handleValueChange}
            showShortcuts={false}
            placeholder="Select date range"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-lg font-bold text-gray-900">
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
      <div className="flex flex-col gap-3">
        <h1 className="text-lg font-bold text-gray-900">
          Awards / Certificates
        </h1>
        <UploadComponent
          permittedFileInfo={permittedFileInfo}
          setFileObj={setFileObj}
          startUpload={startUpload}
          filesObj={filesObj}
        />
        {/* <div>
          {files.length > 0 &&
            files.map((file) => (
              <div key={file}>
                {file.trim().length > 0 && (
                <div className="aspect-h-1 aspect-w-1 lg:aspect-none w-full overflow-hidden rounded-md  group-hover:opacity-75 lg:h-48">
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
                    className="inline-flex mt-3 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Delete award
                  </button>
                </div>
              )}
              </div>
            ))}
        </div> */}
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-lg font-bold text-gray-900">Reflections</label>
        <textarea
          onChange={(e) => setReflection(e.target.value)}
          className="rounded-md  border-2 bg-white px-4 py-2 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-lg font-bold text-gray-900">Assign</label>
        <InitialAssignActivity
          activitySetId={activitySet}
          setCheckedCount={setCheckedCount}
          setSetArr={setSetArr}
        />
      </div>

      {user.isLoaded && user.isSignedIn && (
        <button
          className="-mt-8 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-500"
          disabled={
            fileUploadLoading ||
            createNewActivity.isLoading ||
            !dates.startDate ||
            !name
          }
          onClick={async () => {
            if (filesObj.length > 0) {
              await startUpload(filesObj);
            }
            createNewActivity.mutate({
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
              activitySetIds: setArr.length > 0 ? setArr : undefined,
              stillActive,
            });
          }}
        >
          Create activity
        </button>
      )}
    </div>
  );
};

export default CreateActivity;
