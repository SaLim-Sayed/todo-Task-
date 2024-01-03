import {
    Skeleton,
    SkeletonText,
    CardFooter,
    Card,
    Divider,
    Stack,
    CardBody,
    
    Box,
    Center,
  } from "@chakra-ui/react";
 
 
  const loading = () => {
   
    
  
    return (
      <Box w={"50%"} minW={{ sm: "400px", base: "100%" }} mx={"auto"}>
        
        <Center>
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            p={4}
            m={2}
            w={"100%"}
          >
            <Skeleton
              mx={"auto"}
              h={"200px"}
              minW={{ sm: "50%", base: "100%" }}
            />
            <Stack mx={"auto"}>
              <CardBody>
                <SkeletonText
                  mt="4"
                  noOfLines={1}
                  spacing="4"
                  w={"100%"}
                  mx={"2px"}
                />
                <SkeletonText
                  mt="4"
                  noOfLines={2}
                  spacing="4"
                  w={40}
                  mx={"auto"}
                />
              </CardBody>
              <Divider />
              <CardFooter>
                <Skeleton height="20px"  w={"100%"} mx={"auto"} />
              </CardFooter>
            </Stack>
          </Card>
        </Center>
      </Box>
    );
  };
  
  export default loading;
  