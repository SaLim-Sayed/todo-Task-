/* eslint-disable react/no-unescaped-entities */
"use client";

import { useLoaderStore } from "@/hooks/futures/alertSlice";
import useUserStore from "@/hooks/futures/userStore";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Link from "next/link";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputRightElement,
  InputGroup,
  FormErrorMessage,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { useAuthStore } from "@/hooks/futures/authStore";
import axios from "axios";
import { URI } from "@/hooks/api/client";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { showLoading } = useLoaderStore();
  const { setUser } = useUserStore();
  const { auth, setAuth } = useAuthStore();
  // Create Zod schema
  const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Password is required" }),
  });

  type SignupType = z.infer<typeof SignupSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupType>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit: SubmitHandler<SignupType> = async (user) => {
    try {
      showLoading(true);
      const data = await axios.post(`${URI}api/login`, user);
      console.log(data.data);
      setAuth(data.data.token);
      localStorage.setItem("token", data.data.token);
      setUser({ ...data.data.user, token: data.data.token });

      showLoading(false);
      router.push("/");

      toast.success(
        <div className=" flex flex-col justify-center items-center gap-2 p-4">
          <div className=" text-[20px] font-[400] text-primaryColor-900 ">
            StatusCode :{data.status}
          </div>
          <div className="  text-[12px] font-thin text-center">
            Status :{data.statusText}
          </div>
        </div>
      );
    } catch (err: any) {
      showLoading(false);
      console.log(err);
      toast.error(
        <div className=" flex flex-col justify-center items-center gap-2 p-4">
          <div className=" text-[20px] font-[400] text-primaryColor-900 ">
            Status :{err.response.status}
          </div>
          <div className="  text-[12px] font-thin text-center">
            Message :{err.response.data}
          </div>
        </div>
      );
    }
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                {...register("email")}
                isInvalid={errors.email ? true : false}
                errorBorderColor="crimson"
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  isInvalid={errors.password ? true : false}
                  errorBorderColor="crimson"
                />

                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Button
                  className=" text-blue-400"
                  onClick={() => router.push("/auth/forgetPassword")}
                >
                  Forgot password?
                </Button>
              </Stack>
              <Button
                colorScheme="teal"
                type="submit"
                loadingText="Submitting"
                size="lg"
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Don't have an account?{" "}
                <Button
                  onClick={() => router.push("/auth/signup")}
                  className=" text-blue-400"
                >
                  Sign up
                </Button>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
