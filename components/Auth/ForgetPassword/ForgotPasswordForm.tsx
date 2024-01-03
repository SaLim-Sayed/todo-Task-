"use client";
import { URI } from "@/hooks/api/client";
import { useLoaderStore } from "@/hooks/futures/alertSlice";
import useUserStore from "@/hooks/futures/userStore";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  FormLabel,
  InputGroup,
  InputRightElement,
  Select,
  Box,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { showLoading } = useLoaderStore();
  const { setUser } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  // Create Zod schema
  const SignupSchema = z.object({
    answer: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email(),
    newPassword: z.string().min(6, { message: "Password is required" }),
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
      const data = await axios.post(`${URI}forgot-password`,
        user
      );
      showLoading(false);
      console.log(data.data);
      router.push("/auth/login");
      toast.success(
        <div className=" flex flex-col justify-center items-center gap-2 p-4">
          <div className=" text-[20px] font-[400] text-primaryColor-900 ">
            StatusCode :{data.status}
          </div>
          <div className="  text-[12px] font-thin text-center">
            Status :{data.data}
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
      <Stack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          You&apos;ll get an email with a reset link
        </Text>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              {...register("email")}
              isInvalid={errors.email ? true : false}
              errorBorderColor="crimson"
              type="email"
            />
          </FormControl>
          <FormControl id="newPassword">
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                {...register("newPassword")}
                type={showPassword ? "text" : "password"}
                isInvalid={errors.newPassword ? true : false}
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
          </FormControl>
          <FormControl id="answer">
            <Select defaultValue={"DEFAULT"}>
              <option value="DEFAULT" selected>
                Security Question
              </option>
              <option value={1}>Enter You Favorite Food Name ?</option>
              <option value={2}>Enter Your Favorite Sports ?</option>
              <option value={3}>Enter Your Best Friend Name ?</option>
            </Select>
            <FormLabel>Answer</FormLabel>
            <Input
              {...register("answer")}
              isInvalid={errors.answer ? true : false}
              errorBorderColor="crimson"
              type="text"
            />
          </FormControl>
        </Stack>
        <Stack spacing={6}>
          <Button type="submit" colorScheme="teal">
            Request Reset
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
