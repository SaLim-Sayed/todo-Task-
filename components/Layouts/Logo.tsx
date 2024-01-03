import { Button } from "@chakra-ui/react";
import { FaSchlix } from "react-icons/fa";

const Logo = (props: any) => {
  return (
    <Button
      variant={"solid"}
      colorScheme={"teal"}
      size={"sm"}
      mr={4}
      leftIcon={<FaSchlix />}
    >
      SaLim
    </Button>
  );
};

export default Logo;
