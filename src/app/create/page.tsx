import { Camera } from '@public/camera';
import profileImage from '@public/profImage.png';
import Image from 'next/image';

const page = () => {
  return (
    <div className="mx-auto w-11/12">
      <p className="mb-8 mt-5 font-bold text-[#646767]">create user</p>
      <div className="">
        <div className="mb-8 flex justify-between">
          <label className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-[#646767] opacity-60">
            <Camera />
          </label>
          <Image
            width={80}
            height={80}
            src={profileImage.src}
            className="block h-20 w-20 rounded-full"
            alt="icon"
            priority={true}
          />
          <button className="h-8 w-20 rounded-lg bg-[#646767] text-[#DDBFAE]">
            create
          </button>
        </div>
        <p className="text-xs font-bold text-[#646767] opacity-50">Name</p>
        <input
          type="text"
          placeholder="Name"
          className="mb-12 h-9 w-full rounded-md border border-[#6E96A5]"
        />
        <p className="text-xs font-bold text-[#646767] opacity-50">
          Description
        </p>
        <textarea
          placeholder="Description"
          className="h-32 w-full rounded-md border border-[#6E96A5]"
        />
      </div>
    </div>
  );
};

export default page;
