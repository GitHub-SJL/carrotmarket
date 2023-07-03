import { FieldErrors, useForm } from "react-hook-form";
interface LoginForm {
  username: string;
  password: string;
  email: string;
}
export default function Forms() {
  const { register, handleSubmit } = useForm<LoginForm>();

  const onValid = (data: LoginForm) => {
    console.log("im valid bby");
    console.log(data);
  };
  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input
        {...register("username", {
          required: "username is required",
          minLength: {
            message: "The username should be longer than 5 chars.",
            value: 5,
          },
        })}
        type="text"
        placeholder="Username"
        required
      />
      <input
        {...register("email", { required: "Email is required" })}
        type="email"
        placeholder="Email"
        required
      />
      <input
        {...register("password", { required: "Password is required" })}
        type="password"
        placeholder="Password"
        required
      />
      <input type="submit" value="Create Account" />
    </form>
  );
}
