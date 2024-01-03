import { Box, CircularProgress, Spinner } from "@chakra-ui/react";

export default function SpinnerCard() {
  return (
    <Box className=" flex justify-center  items-center h-screen z-50">
      <Spinner speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  );
}
