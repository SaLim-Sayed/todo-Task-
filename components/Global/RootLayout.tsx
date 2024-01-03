/* eslint-disable react/no-unescaped-entities */

import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
   
} from "@chakra-ui/react";
import Image from "next/image";
import hero from "@/public/hero.svg";
 

export default function RootLayout() {
  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Social Media 
          <Text as={"span"} color={"teal"}>
            made easy
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Welcome to the digital realm where ideas flow, connections thrive, and
          communities come alive – welcome to social media. At its core, social
          media is a dynamic platform that transcends distances, fostering
          connections, and amplifying voices. It's not just about sharing
          moments; its a global conversation shaping the way we communicate,
          learn, and engage.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Button rounded={"full"} px={6} colorScheme={"teal"}>
            Get started
          </Button>
          <Button rounded={"full"} px={6}>
            Learn more
          </Button>
        </Stack>
        <Flex w={"50%"}>
          <Image src={hero} alt={"Hero image"} layout="intrinsic" />
        </Flex>
      </Stack>
    </Container>
  );
}
