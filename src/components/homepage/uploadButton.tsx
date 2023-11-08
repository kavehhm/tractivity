import React, { useCallback } from "react";
import { FileWithPath } from "@uploadthing/react";

import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept, UploadFileResponse } from "uploadthing/client";

const UploadComponent = ({
  setFileObj,
  filesObj,
  permittedFileInfo,
  startUpload
}: {
  setFileObj: React.Dispatch<React.SetStateAction<File[]>>
  permittedFileInfo: any;
  filesObj:File[]
  startUpload: (files: File[], input?: undefined) => Promise<UploadFileResponse[] | undefined>

}) => {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFileObj(acceptedFiles);
  }, []);

 

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div
      className="relative z-30  w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div>
        {filesObj.length > 0 && (
          <p>
            {filesObj.length} {filesObj.length == 1 ? `file` : `files`} will be
            uploaded on submission
          </p>
        )}
      </div>
      Drop files here!<br></br> (Images and PDFs)
    </div>
  );
};

export default UploadComponent;

{
  /* <UploadDropzone<OurFileRouter>
className="relative z-50  w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
endpoint="imageUploader"
config={{mode:"manual"}}
onClientUploadComplete={(res) => {
  // Do something with the response
  if (res) {
    const filesArr: string[] = [];
    res.map((file) => filesArr.push(file.url));
    setFiles((prev) => [...filesArr, ...prev]);
  }
  toast.success("File uploaded!");
  setFileUploadLoading(false);
  console.log("Files: ", res);
}}
onUploadBegin={() => setFileUploadLoading(true)}
onUploadError={(error: Error) => {
  // Do something with the error.
  setFileUploadLoading(false);

  alert(`ERROR! ${error.message}`);
}}
/> */
}
