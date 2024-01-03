"use client";

import { URI } from "@/hooks/api/client";
import { useLoaderStore } from "@/hooks/futures/alertSlice";
import { useAuthStore } from "@/hooks/futures/authStore";
import useUserStore from "@/hooks/futures/userStore";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
  FormLabel,
  Box,
  Textarea,
  Image,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import { z } from "zod";

export default function CreatePost() {
  const { showLoading } = useLoaderStore();
  const { auth } = useAuthStore();
  const [image, setImage] = useState({
    url: null,
    public_id: null,
  });
  const [uploading, setUploading] = useState(false);

  // Create Zod schema
  const PostSchema = z.object({
    content: z.string().min(2, { message: "Last name is required" }),
  });

  type SignupType = z.infer<typeof PostSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupType>({
    resolver: zodResolver(PostSchema),
  });

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
  const onSubmit: SubmitHandler<SignupType> = async (post) => {
    try {
      showLoading(true);
      const content = post.content;
      const data = await axios.post(
        `${URI}api/createpost`,
        { content, image },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );

      showLoading(false);
      console.log(data);
      toast.success(
        <div className=" flex flex-col justify-center items-center gap-2 p-4">
          <div className=" text-[20px] font-[400] text-primaryColor-900 ">
            StatusCode :{data.status}
          </div>
          <div className="  text-[12px] font-thin text-center">
            Status : {data.statusText}
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
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={4}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Create Post
        </Heading>

        <Stack spacing={4}>
          <FormControl id="content">
            <FormLabel>content</FormLabel>
            <Textarea
              {...register("content")}
              isInvalid={errors.content ? true : false}
              errorBorderColor="crimson"
              placeholder="Here is a sample placeholder"
            />
          </FormControl>
          <HStack justify={"space-between"} spacing={6}>
            <Box>
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
                  ""
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
            </Box>
            <Box w={"50%"} maxW={"md"}>
              <Stack spacing={6}>
                <Button type="submit" colorScheme="teal">
                  Post
                </Button>
              </Stack>
            </Box>
          </HStack>
        </Stack>
      </Stack>
    </Flex>
  );
}
