import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../Context/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const mutation = useMutation(apiClient.Register, {
    onSuccess: async () => {
      showToast({
        message: "User Registration Successfully!",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries("validateToken");

      navigate("/");
    },
    onError: (error: Error) => {
      console.log(error);
      showToast({ message: "Something went wrong!", type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data: RegisterFormData) => {
    mutation.mutate(data);
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <form onSubmit={onSubmit} className=" w-full flex flex-col gap-2 p-5">
        <h1 className="text-2xl font-bold text-orange-300">Register Here </h1>
        <label className="flex flex-col">
          Enter your first name:
          <input
            placeholder="first name"
            className="w-full border border-b-black border-b-6 text-gray-500 font-bold outline-none"
            {...register("firstName", {
              required: "This field is required",
            })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="flex flex-col">
          Enter your last name:
          <input
            placeholder="last name"
            className="w-full border border-b-black border-b-6 text-gray-500 font-bold outline-none"
            {...register("lastName", {
              required: "This field is required",
            })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
        <label className="flex flex-col">
          Email
          <input
            type="email"
            placeholder="email"
            className="w-full border border-b-black border-b-6 text-gray-500 font-bold outline-none"
            {...register("email", {
              required: "This field is required",
            })}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </label>
        <label className="flex flex-col">
          UserName
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-b-black border-b-6 text-gray-500 font-bold outline-none"
            {...register("username", {
              required: "This field is required",
            })}
          />
          {errors.username && (
            <span className="text-red-500">{errors.username.message}</span>
          )}
        </label>
        <label className="flex flex-col">
          Password
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-b-black border-b-6 text-gray-500 font-bold outline-none"
            {...register("password", {
              required: "This field is required",
            })}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </label>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="bg-orange-500 p-2 text-white hover:bg-orange-400 disabled:bg-gray-500"
          >
            {mutation.isLoading ? "Loading ..." : "Register"}
          </button>
        </div>
      </form>
      <p className="text-sm text-left">
        Already have an acount?{" "}
        <Link to="/sign-in" className="text-blue-500">
          Login{" "}
        </Link>
      </p>
    </div>
  );
};
export default Register;
