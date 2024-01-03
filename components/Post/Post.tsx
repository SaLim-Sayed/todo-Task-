"use client";
import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import CreatePost from "./Create/CreatePost";
import GetPost from "./Get/GetPost";
import axios from "axios";
import { useAuthStore } from "@/hooks/futures/authStore";
import hero from "@/public/hero.svg";
import Image from "next/image";
import { URI } from "@/hooks/api/client";
interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  image?: {
    url: string;
    public_id: string;
  };
  likes?: any[];
  postedBy?: {
    _id: string;
    name: string;
  };
  __v?: number;
}

type PostArray = Comment[];

export default function Post() {
  const [posts, setPosts] = useState<PostArray>([]); // Use the defined type

  const { auth } = useAuthStore();

  const fetchUserPosts = async () => {
    try {
  const { data } = await axios.get(`${URI}api/user-post`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    fetchUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch user posts on component mount

  return (
    <Box>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab
            _selected={{ color: "white", bg: "green.400" }}
            onClick={fetchUserPosts}
          >
            TODO
          </Tab>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>Create</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="flex">
              <div className=" max-h-screen  overflow-auto    lg:w-[60%]  w-[100%] ">
                {posts.map((post) => (
                  <GetPost key={post._id} post={post} />
                ))}
              </div>
              <div className=" w-[40%]  hidden  left-0 sticky top-10 lg:flex items-center justify-center">
                <Image src={hero} alt="Hero" />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <CreatePost />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
