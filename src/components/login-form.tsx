import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { LoginData } from "@/models/LoginData";
import { loginUser } from "@/service/authService";
import toast from "react-hot-toast";
import useAuth from "@/stores/authStores";
import { SpinnerCustom } from "./ui/spinner";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // initial state
  const [inputs, setInputs] = useState<LoginData>({
    email: "",
    password: "",
  });
  // handle change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  //        <FaEye />  <FaEyeSlash />
  //Hide/Show Password functionality
  const [showPassword, setShowPassword] = useState(false);

  // handle blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };
  // error state
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const showEmailError = touched.email && !inputs.email.trim();
  const showPasswordError = touched.password && !inputs.password.trim();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const login = useAuth((state) => state.login);
  // form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputs);

    // validation
    if (!inputs.email.trim() || !inputs.password.trim()) {
      toast.error("All fields are required!");
      return;
    }

    if (!inputs.email.trim()) {
      toast.error("Email is required!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      return toast.error("Invalid email!");
    }

    if (!inputs.password.trim()) {
      toast.error("Password is required!");
      return;
    }

    if (inputs.password.length < 6)
      return toast.error("Password must be at least 6 characters!");

    try {
      setIsLoading(true);
      const response = await loginUser(inputs);
      console.log(response);
      // login funtion : useAuth
      // await loginUser(inputs);
      toast.success("Login successful!");
      login(inputs);
      // navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  value={inputs.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={cn("mt-1", showEmailError && "border-red-500")}
                />
                {showEmailError && (
                  <FieldDescription className="text-red-500">
                    Email is required
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>

                {/* ✅ Input + Eye icon wrapper */}
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={inputs.password}
                    placeholder="*********"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(
                      "pr-10",
                      showPasswordError && "border-red-500",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  >
                    {!showPassword ? <FaEyeSlash  /> : <FaEye />}
                  </button>
                </div>

                {showPasswordError && (
                  <FieldDescription className="text-red-500">
                    Password is required
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      {" "}
                      <SpinnerCustom /> Loading...{" "}
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <NavLink to={`${"http://localhost:8080/oauth2/authorization/google"}`} className="w-full">
                  <Button variant="outline" type="button" className="w-full cursor-pointer">
                    Login with Google
                  </Button>
                </NavLink>
                <NavLink to={`${"http://localhost:8080/oauth2/authorization/github"}`} className="w-full">
                  <Button variant="outline" type="button" className="w-full cursor-pointer">
                    Login with GitHub
                  </Button>
                </NavLink>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="signup">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
