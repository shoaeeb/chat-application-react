import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { useMutation, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

export type LoginFormData = {
  username: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const mutation = useMutation(apiClient.login, {
    onSuccess: async () => {
      showToast({ message: "User Logged In", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: "Something went wrong", type: "ERROR" });
      console.log(error);
    },
  });

  const onSubmit = handleSubmit((data: LoginFormData) => {
    mutation.mutate(data);
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <form onSubmit={onSubmit} className=" w-full flex flex-col gap-2 p-5">
        <h1 className="text-2xl font-bold text-orange-300">Login Here </h1>
        <label className="flex flex-col">
          Enter your username:
          <input
            placeholder="username"
            className="w-full border border-b-black border-b-6 text-gray-500 font-bold outline-none"
            {...register("username", {
              required: "This field is required",
            })}
          />
          {errors.username && (
            <span className="text-sm text-red-500">
              {errors.username.message}
            </span>
          )}
        </label>
        <label className="flex flex-col">
          Enter your passsword
          <input
            type="password"
            placeholder="password"
            className="w-full border border-b-black border-b-6 text-gray-500 font-bold outline-none"
            {...register("password", {
              required: "This field is required",
            })}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="bg-orange-500 p-2 text-white hover:bg-orange-400 disabled:bg-gray-500"
          >
            {mutation.isLoading ? "Loading ..." : "Login"}
          </button>
        </div>
      </form>
      <p className="text-sm text-left">
        Don't have a account?{" "}
        <Link to="/register" className="text-blue-500">
          Register{" "}
        </Link>
      </p>
    </div>
  );
};
export default Login;
