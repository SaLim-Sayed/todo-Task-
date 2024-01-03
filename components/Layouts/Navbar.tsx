/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ToastContainer } from "react-toastify";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { IconType } from "react-icons";
import Footer from "./Footer";
import { ReactNode, Suspense, useEffect } from "react";
import Logo from "./Logo";
import { FaRegMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useLoaderStore } from "@/hooks/futures/alertSlice";
import SpinnerCard from "../Global/Spinner";
import useUserStore from "@/hooks/futures/userStore";
import { useAuthStore } from "@/hooks/futures/authStore";
import Link from "next/link";
import Login from "../Auth/Login/Login";
import SignupCard from "../Auth/Signup/Signup";
import ForgotPasswordForm from "../Auth/ForgetPassword/ForgotPasswordForm";
import Auth from "../Auth/Auth";

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  url: string;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, url: "/" },
  { name: "Todo", icon: FiCompass, url: "/post" },
  { name: "Favorites", icon: FiStar, url: "/favorites" },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          <Logo />
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} url={link.url} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ url, icon, children, ...rest }: NavItemProps) => {
  return (
    <Link href={url} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { showLoading } = useLoaderStore();
  const { user, setUser } = useUserStore();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const { auth, setAuth } = useAuthStore();

  const signOut = () => {
    showLoading(true);
    setAuth("");
    setUser({
      name: "",
      email: "",
      token: "",
      _id: "",
    });
    showLoading(false);
    router.push("/auth/login");
    window.location.reload();
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        <Logo />
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Button size="sm" variant="ghost" onClick={toggleColorMode}>
          {colorMode === "light" ? <FiMoon /> : <FiSun />}
        </Button>
        {!auth && (
          <Button
            onClick={() => router.push("/auth/login")}
            variant={"solid"}
            colorScheme={"teal"}
            size={"sm"}
            mr={4}
            leftIcon={<FaUserCircle />}
          >
            Login
          </Button>
        )}
        <Flex alignItems={"center"}>
          <Menu>
            {user && (
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
              >
                <HStack>
                  <Avatar
                    size={"sm"}
                    src={
                      user?.image?.url||
                      "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                    }
                  />
                  <VStack
                    display={{ base: "none", md: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">{user && user?.name}</Text>
                    <Text fontSize="xs" color="gray.600">
                    {user && user?.about}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
            )}
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={() => router.push("/auth/profile")}>
                Profile
              </MenuItem>
            
              <MenuDivider />
              <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const Navbar = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loading } = useLoaderStore();
  const { auth, setAuth } = useAuthStore();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      (auth && path === "/auth/login") ||
      path === "/auth/signup" ||
      path === "/auth/forgetPassword"
    ) {
      router.push("/");
    }
  }, []);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box
        minH={"57vh"}
        className="flex flex-col  justify-between gap-6 "
        ml={{ base: 0, md: 60 }}
        p="4"
      >
        {loading && <SpinnerCard />}
        {!loading && auth ? children : <Auth />}
        <ToastContainer position="bottom-right" />
      </Box>
      <Box p={{ base: "0", md: "1" }} ml={{ base: 0, md: 60 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Navbar;
