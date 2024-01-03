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
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useLoaderStore } from "@/hooks/futures/alertSlice";
import Link from "next/link";
import useUserStore from "@/hooks/futures/userStore";
import { useAuthStore } from "@/hooks/futures/authStore";
import { FaCamera } from "react-icons/fa";
import { URI } from "@/hooks/api/client";

export default function Profile() {
  const { setUser, user } = useUserStore();
  const { auth, setAuth } = useAuthStore();
  const router = useRouter();
  const { showLoading } = useLoaderStore();
  const [showPassword, setShowPassword] = useState(false);
  // Create Zod schema
  const SignupSchema = z.object({
    username: z.string().min(2, { message: "Username is required" }),
    about: z.string().min(2, { message: "about is required" }),
    name: z.string().min(2, { message: "First name is required" }),
    answer: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "Password is required" }),
  });

  type SignupType = z.infer<typeof SignupSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupType>({
    resolver: zodResolver(SignupSchema),
  });

  const [image, setImage] = useState({
    url: null,
    public_id: null,
  });
  const [uploading, setUploading] = useState(false);

  // Create Zod schema

  //handle image upload
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files as FileList;
    let formData = new FormData();
    formData.append("image", selectedFile?.[0]);
    try {
      setUploading(true);
      const { data } = await axios.post(
        `${URI}api/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );

      setUploading(false);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
    } catch (err: any) {
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
  const onSubmit: SubmitHandler<SignupType> = async (user) => {
    try {
      showLoading(true);
      const { username, name, email, password, about, answer } = user;
      const info = { username, name, email, password, about, answer, image };
      const data = await axios.put(
        `${URI}api/profile-update`,
        info,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
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
      showLoading(false);
      router.push("/");
      setUser(data.data);
    } catch (err) {
      toast.error(
        <div className=" flex flex-col justify-center items-center gap-2 p-4">
          <div className=" text-[20px] font-[400] text-primaryColor-900 ">
            Status :
          </div>
          <div className="  text-[12px] font-thin text-center">Message :</div>
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
            Profile Details
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
            <FormControl
              className=" cursor-pointer flex items-center "
              id="image"
            >
              <FormLabel>
                <FaCamera size={40} className=" cursor-pointer" />
              </FormLabel>
              {image && image.url ? (
                <Image
                  src={image.url}
                  alt=""
                  w={"50px"}
                  h={"50px"}
                  shadow={"lg"}
                  rounded={"full"}
                />
              ) : uploading ? (
                <>
                  <Spinner
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                </>
              ) : (
                
                <Image
                  src={user?.image?.url}
                  alt=""
                  w={"200px"}
                  h={"200px"}
                  shadow={"lg"}
                  rounded={"full"}
                />
              )}

              <input
                type="file"
                accept="images/*"
                onChange={handleImage}
                name="image"
                id="image"
                hidden
              />
            </FormControl>
            <FormControl id="username">
              <FormLabel>User Name</FormLabel>
              <Input
                {...register("username")}
                defaultValue={user?.username}
                isInvalid={errors.username ? true : false}
                errorBorderColor="crimson"
                type="text"
              />
            </FormControl>
            <FormControl id="about">
              <FormLabel>about</FormLabel>
              <Input
                {...register("about")}
                defaultValue={user?.about}
                isInvalid={errors.about ? true : false}
                errorBorderColor="crimson"
                type="text"
              />
            </FormControl>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                {...register("name")}
                defaultValue={user?.name}
                isInvalid={errors.name ? true : false}
                errorBorderColor="crimson"
                type="text"
              />
            </FormControl>

            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                {...register("email")}
                defaultValue={user?.email}
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
                defaultValue={user?.answer}
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
                Update Profile
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
