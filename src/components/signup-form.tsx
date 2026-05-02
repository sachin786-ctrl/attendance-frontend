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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { SignupData } from "@/models/SignupData";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { registerUser } from "@/service/authService";
import { SpinnerCustom } from "./ui/spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [inputs, setInputs] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
  });

  //show/hide password
  const [showPassword, setShowPassword] = useState(false);
  // terms checkbox state
  const [termsAccepted, setTermsAccepted] = useState(false);
 


  // change handler for all inputs function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  // blur handler for all inputs function
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setTouched((values) => ({ ...values, [name]: true }));
  };

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    terms: false,
  });

  const showNameError = touched.name && !inputs.name.trim();
  const showEmailError = touched.email && !inputs.email.trim();
  const showPasswordError = touched.password && !inputs.password.trim();
  const showTermsError = touched.terms && !termsAccepted;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // navigate
  const navigate = useNavigate();

  // Submit pe sabhi fields touched mark karo
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      terms: true,
    });
    console.log(inputs);

    // validation
    if (
      !inputs.name.trim() ||
      !inputs.email.trim() ||
      !inputs.password.trim() ||
      !termsAccepted.valueOf()
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (!inputs.name.trim()) {
      toast.error("Name is required!");
      return;
    }

    if (inputs.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters!");
      return;
    }

    if (!inputs.email.trim()) {
      toast.error("Email is required!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      toast.error("Please enter a valid email!");
      return;
    }

    if (!inputs.password.trim()) {
      toast.error("Password is required!");
      return;
    }

    if (inputs.password.trim().length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    // Form submitted successfully
    try {
      setIsLoading(true);
      const response = await registerUser(inputs);
      console.log(response);
      navigate("/login");
      toast.success("Account created successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Account creation failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="John Doe"
                  onBlur={handleBlur}
                  className={showNameError ? "border-red-500" : ""}
                />
                <p className="text-sm text-red-500">
                  {showNameError && "Name is required"}
                </p>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={showEmailError ? "border-red-500" : ""}
                />
                <p className="text-sm text-red-500">
                  {showEmailError && "Email is required"}
                </p>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                {/* ✅ Relative wrapper */}
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={inputs.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={cn(
                      "pr-10",
                      showPasswordError ? "border-red-500" : "",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  >
                    {!showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-sm text-red-500">
                  {showPasswordError && "Password is required"}
                </p>
              
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
              </Field>
              <Field>
                 {/* // ✅ Terms and conditions checkbox */}
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    onBlur={handleBlur}
                    className={cn(
                      "mr-2",
                      showTermsError && "text-red-500",
                    )}
                  />
                  <label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <a href="#" className="underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
                <p className="text-sm text-red-500">
                  {showTermsError && "You must accept the terms"}
                </p>
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      {" "}
                      <SpinnerCustom /> Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="login">Sign in</a>
                </FieldDescription>
              </Field>
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
