import * as Avatar from "@radix-ui/react-avatar";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { useAppContext } from "../Context/AppContext";

type ProfileUpdateForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePic: string;
};

const Profile = () => {
  const { data: Profile } = useQuery("getProfile", apiClient.getMyProfile, {
    refetchOnWindowFocus: false,
  });
  const { handlePreviewImg, previewImg } = usePreviewImg();
  const fileRef = useRef<HTMLInputElement>(null);

  const { showToast } = useAppContext();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileUpdateForm>();

  useEffect(() => {
    if (Profile) {
      setValue("firstName", Profile.firstName);
      setValue("lastName", Profile.lastName);
      setValue("email", Profile.email);
      setValue("password", Profile.password);
      setValue("profilePic", Profile.profilePic);
    }
  }, [Profile, setValue]);
  const mutation = useMutation(
    (data: any) => apiClient.updateProfile(Profile?._id || " ", data),
    {
      onSuccess: () => {
        showToast({ message: "Profile Updated Successfully", type: "SUCCESS" });
      },
      onError: () => {
        showToast({ message: "Something went wrong", type: "ERROR" });
      },
    }
  );

  const onSubmit = handleSubmit((data: ProfileUpdateForm) => {
    data.profilePic = previewImg?.toString() || "";
    mutation.mutate(data);
  });

  return (
    <div className="flex h-screen justify-center flex-col items-center">
      <h3 className="text-2xl">Profile Update</h3>
      <form
        onSubmit={onSubmit}
        className="border border-slate-500 w-[500px] px-2 py-2 flex flex-col gap-2"
      >
        <Avatar.Root>
          <Avatar.Image
            className="rounded-full w-20 h-25 mx-auto"
            src={previewImg?.toString() || Profile?.profilePic}
            alt={Profile?.firstName + "" + Profile?.lastName}
            onClick={() => {
              fileRef?.current?.click();
            }}
          />
          <Avatar.Fallback />
        </Avatar.Root>
        <input ref={fileRef} onChange={handlePreviewImg} type="file" hidden />
        <label className="flex flex-col">
          First Name:
          <input
            type="text"
            placeholder="Enter your firstname"
            className="border border-slate-500 px-2 py-1"
            {...register("firstName", { required: "First Name is required" })}
          />
        </label>
        {errors.firstName && (
          <span className="text-red-500 text-sm">
            {errors.firstName.message}
          </span>
        )}
        <label className="flex flex-col">
          Last Name:
          <input
            type="text"
            placeholder="Enter your LastName"
            className="border border-slate-500 px-2 py-1"
            {...register("lastName", { required: "Last Name is required" })}
          />
        </label>{" "}
        {errors.lastName && (
          <span className="text-red-500 text-sm">
            {errors.lastName.message}
          </span>
        )}
        <label className="flex flex-col">
          Email:
          <input
            type="text"
            placeholder="Enter your email"
            className="border border-slate-500 px-2 py-1"
            {...register("email", { required: "Email is required" })}
          />
        </label>
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
        <label className="flex flex-col">
          password:
          <input
            type="password"
            placeholder="Enter your Password"
            className="border border-slate-500 px-2 py-1"
            {...register("password")}
          />
        </label>
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password?.message}
          </span>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-orange-300 hover:bg-orange-400 text-white px-2 py-1"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
