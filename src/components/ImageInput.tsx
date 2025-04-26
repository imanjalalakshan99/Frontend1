import React from "react";
import Img from "./Img";
import { FiUpload } from "react-icons/fi";

interface Props {
  defaultImage?: string;
  file?: File;
  onChange: (file: File | undefined) => void;
  className?: string;
}

const ImageInput = ({ defaultImage, file, onChange, className }: Props) => {
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    onChange(file);
  };

  return (
    <div className={"relative " + className}>
      {!file && defaultImage && (
        <Img
          src={`/${defaultImage}`}
          className="absolute z-10 h-full w-full object-cover"
        />
      )}
      {file && (
        <img
          src={URL.createObjectURL(file)}
          className="absolute z-10 h-full w-full object-cover"
        />
      )}
      <div className="absolute z-20 flex h-full w-full items-center justify-center bg-[#00000048] text-white">
        <FiUpload className="text-4xl drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]" />
      </div>
      <input
        type="file"
        accept=".jpeg,.jpg,.png,.gif"
        onChange={handleFileInputChange}
        className="absolute z-20 h-full w-full cursor-pointer opacity-0"
        multiple={false}
      />
    </div>
  );
};

export default ImageInput;
