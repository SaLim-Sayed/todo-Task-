"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useLoaderStore } from "@/hooks/futures/alertSlice";
import Link from "next/link";
import { URI } from "@/hooks/api/client";

export default function SignupCard() {
  const router = useRouter();
  const { showLoading } = useLoaderStore();
  const [showPassword, setShowPassword] = useState(false);
  // Create Zod schema
  const SignupSchema = z.object({
    name: z.string().min(2, { message: "First name is required" }),
    answer: z.string().min(2, { message: "Last name is required" }),
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
      const { data } = await axios.post(
         `${URI}api/register`,
        user
      );
      showLoading(false);
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
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
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
            <FormControl id="name">
              <FormLabel>First Name</FormLabel>
              <Input
                {...register("name")}
                isInvalid={errors.name ? true : false}
                errorBorderColor="crimson"
                type="text"
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                {...register("email")}
                isInvalid={errors.email ? true : false}
                errorBorderColor="crimson"
                type="email"
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
              <FormErrorMessage>
                {errors.answer && errors.answer.message}
              </FormErrorMessage>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                colorScheme="teal"
                type="submit"
                loadingText="Submitting"
                size="lg"
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link href="/auth/login" className=" text-blue-400">
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
