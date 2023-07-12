import type { NextPage } from "next";
import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import useUser from "@/libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useMutation from "@/libs/client/useMutation";
interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditProfileForm>();

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
  }, [user, setValue]);

  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>("/api/users/me");

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("formErrors", { message: data.error });
    }
  }, [data, setError]);

  const onValid = ({ email, phone, name }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === "" && name === "") {
      setError("formErrors", {
        message: "Email OR Phone number are required. You need to choose one.",
      });
    }

    editProfile({ email, phone, name });
  };

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 px-4 py-10">
        <div className="flex items-center space-x-3">
          <div className="h-14 w-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          required={false}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          required={false}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          required={false}
          register={register("phone")}
          label="Phone number"
          name="phone"
          type="text"
          kind="phone"
        />
        {errors.formErrors ? (
          <span className="my-2 block text-center font-medium text-red-500">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
