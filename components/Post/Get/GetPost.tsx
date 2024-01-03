"use client";

import useUserStore from "@/hooks/futures/userStore";
import Image from "next/image";
import {
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaComment, FaHeart } from "react-icons/fa";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { useLoaderStore } from "@/hooks/futures/alertSlice";
import { useAuthStore } from "@/hooks/futures/authStore";
import { URI  } from "@/hooks/api/client";
export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  image?: {
    url: string;
    public_id: string;
  };
  likes?: any[]; // Replace with the actual type for likes
  postedBy?: {
    _id: string;
    name: string;
  };
  __v?: number;
}

const GetPost: React.FC<any> = ({ post }) => {
  const router = useRouter();
  const dateString = post.createdAt;
  const dateObject = new Date(dateString);

  // Format options can be adjusted based on your requirements
  const formattedDate = dateObject.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  });

  const { showLoading } = useLoaderStore();
  const { auth } = useAuthStore();
  // Create Zod schema

  const deleteHandler = async (id: string) => {
    try {
      showLoading(true);
      const data = await axios.delete(
        `${URI}api/delete-post/${id}`,

        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );

      showLoading(false);
      console.log(data);
      router.push("/post");
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

  const { user } = useUserStore();
  return (
    <Center py={6}>
      <Box
        maxW={"445px"}
        w={"full"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
      >
        <Stack mb={6} direction={"row"} spacing={4} align={"center"}>
          <Avatar
            src={"https://avatars0.githubusercontent.com/u/1164541?v=4"}
          />
          <Stack direction={"column"} spacing={0} fontSize={"sm"}>
            <Text fontWeight={600}> {post.postedBy.name} </Text>
            <Text color={"gray.500"}>{formattedDate}</Text>
          </Stack>
        </Stack>
        {post.image.url && (
          <Box h={"210px"} bg={"gray.100"} mb={6} pos={"relative"}>
            <Image src={post.image.url} fill alt={post.postedBy.name} />
          </Box>
        )}

        <Center>
          <Box>
            <Text
              textAlign={"center"}
              color={useColorModeValue("gray.700", "gray.400")}
              px={3}
            >
              {post.content}
              <Text color={"blue.400"}>#tag</Text> me in your posts
            </Text>
            <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
              <Badge
                px={2}
                py={1}
                bg={useColorModeValue("gray.50", "gray.800")}
                fontWeight={"400"}
              >
                #art
              </Badge>
              <Badge
                px={2}
                py={1}
                bg={useColorModeValue("gray.50", "gray.800")}
                fontWeight={"400"}
              >
                #photography
              </Badge>
              <Badge
                px={2}
                py={1}
                bg={useColorModeValue("gray.50", "gray.800")}
                fontWeight={"400"}
              >
                #music
              </Badge>
            </Stack>
            <Stack mt={8} direction={"row"} spacing={4}>
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                colorScheme="red"
                rightIcon={<FaHeart />}
              >
                5
              </Button>
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                colorScheme="teal"
                boxShadow={
                  "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                }
                rightIcon={<FaComment />}
              >
                3
              </Button>
              {user && user?._id === post.postedBy._id && (
                <>
                  <Button
                    onClick={() => deleteHandler(post._id)}
                    fontSize={"sm"}
                    rounded={"full"}
                    colorScheme="red"
                    rightIcon={<DeleteIcon />}
                  ></Button>
                  <Button
                    onClick={() => router.push(`/post/${post._id}`)}
                    fontSize={"sm"}
                    rounded={"full"}
                    colorScheme="teal"
                    boxShadow={
                      "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                    }
                    rightIcon={<EditIcon />}
                  ></Button>
                </>
              )}
            </Stack>
          </Box>
        </Center>
      </Box>
    </Center>
  );
};

export default GetPost;
