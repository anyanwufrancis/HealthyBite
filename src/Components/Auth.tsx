import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLeaf } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

// ─── Password visibility toggle ────
function PasswordInput({
  placeholder = "Enter your password",
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <InputGroup>
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        bg="gray.50"
        border="1px solid"
        borderColor="gray.200"
        _hover={{ borderColor: "#6b8f3f" }}
        _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
        rounded="md"
      />
      <InputRightElement>
        <Icon
          as={show ? FaEyeSlash : FaEye}
          color="gray.400"
          cursor="pointer"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        />
      </InputRightElement>
    </InputGroup>
  );
}

// ─── Login Form ──────
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ title: "Please fill in all fields.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
      toast({ title: "Welcome back! 🎉", status: "success", duration: 3000, isClosable: true });
      navigate("/");
    } catch (err: any) {
      toast({ title: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!forgotEmail) {
      toast({ title: "Please enter your email.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForgotSent(true);
    } catch (err: any) {
      toast({ title: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleModalClose = () => {
    onClose();
    setForgotSent(false);
    setForgotEmail("");
  };

  return (
    <>
      <VStack spacing={5} as="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Email address</FormLabel>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ borderColor: "#6b8f3f" }}
            _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
            rounded="md"
          />
        </FormControl>

        <FormControl isRequired>
          <Flex justify="space-between" align="center" mb={1}>
            <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={0}>Password</FormLabel>
            {/* ✅ Opens forgot password modal */}
            <Text
              fontSize="xs"
              color="#6b8f3f"
              fontWeight="semibold"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={onOpen}
            >
              Forgot password?
            </Text>
          </Flex>
          <PasswordInput value={password} onChange={setPassword} />
        </FormControl>

        <Button
          type="submit"
          w="full"
          bg="#6b8f3f"
          color="white"
          size="lg"
          rounded="md"
          isLoading={loading}
          loadingText="Signing in…"
          _hover={{ bg: "#5a7a34" }}
          transition="background 0.2s"
        >
          Login
        </Button>

        <HStack w="full" spacing={3}>
          <Divider borderColor="gray.200" />
          <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">or</Text>
          <Divider borderColor="gray.200" />
        </HStack>

        <Button
          w="full"
          variant="outline"
          borderColor="gray.200"
          color="gray.700"
          size="lg"
          rounded="md"
          fontWeight="medium"
          leftIcon={<Icon as={FcGoogle} boxSize={5} />}
          _hover={{ bg: "gray.50", borderColor: "gray.300" }}
          transition="all 0.2s"
          onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
        >
          Continue with Google
        </Button>
      </VStack>

      {/* ── Forgot Password Modal ── */}
      <Modal isOpen={isOpen} onClose={handleModalClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent rounded="2xl" mx={4}>
          <ModalHeader>
            <Text fontWeight="bold" fontSize="lg" color="gray.800">
              {forgotSent ? "Check your email 📬" : "Reset your password"}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {forgotSent ? (
              <VStack spacing={4} align="start">
                <Text fontSize="sm" color="gray.600" lineHeight="tall">
                  We've sent a password reset link to <strong>{forgotEmail}</strong>.
                  Check your inbox and click the link to reset your password.
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Didn't get it? Check your spam folder or try again.
                </Text>
                <Button
                  w="full"
                  variant="outline"
                  borderColor="#6b8f3f"
                  color="#6b8f3f"
                  rounded="md"
                  onClick={() => { setForgotSent(false); setForgotEmail(""); }}
                >
                  Try a different email
                </Button>
              </VStack>
            ) : (
              <VStack spacing={4}>
                <Text fontSize="sm" color="gray.500" alignSelf="start" lineHeight="tall">
                  Enter the email address linked to your account and we'll send you a reset link.
                </Text>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "#6b8f3f" }}
                    _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
                    rounded="md"
                    onKeyDown={(e) => e.key === "Enter" && handleForgot()}
                  />
                </FormControl>
                <Button
                  w="full"
                  bg="#6b8f3f"
                  color="white"
                  rounded="md"
                  isLoading={forgotLoading}
                  loadingText="Sending…"
                  _hover={{ bg: "#5a7a34" }}
                  onClick={handleForgot}
                >
                  Send Reset Link
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

// ─── Sign Up Form ─────────────────────────────────────────────────────────────
function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirm) {
      toast({ title: "Please fill in all fields.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords do not match.", status: "error", duration: 3000, isClosable: true });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters.", status: "error", duration: 3000, isClosable: true });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
      toast({ title: "Account created! Welcome aboard 🎉", status: "success", duration: 3000, isClosable: true });
      navigate("/");
    } catch (err: any) {
      toast({ title: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={5} as="form" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
      <FormControl isRequired>
        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Full name</FormLabel>
        <Input
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          _hover={{ borderColor: "#6b8f3f" }}
          _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
          rounded="md"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Email address</FormLabel>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          _hover={{ borderColor: "#6b8f3f" }}
          _focus={{ borderColor: "#6b8f3f", boxShadow: "0 0 0 1px #6b8f3f" }}
          rounded="md"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Password</FormLabel>
        <PasswordInput placeholder="Min. 6 characters" value={password} onChange={setPassword} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Confirm password</FormLabel>
        <PasswordInput placeholder="Re-enter your password" value={confirm} onChange={setConfirm} />
      </FormControl>

      <Button
        type="submit"
        w="full"
        bg="#f2b233"
        color="white"
        size="lg"
        rounded="md"
        isLoading={loading}
        loadingText="Creating account…"
        _hover={{ bg: "#e2a324" }}
        transition="background 0.2s"
      >
        Create Account
      </Button>

      <HStack w="full" spacing={3}>
        <Divider borderColor="gray.200" />
        <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">or</Text>
        <Divider borderColor="gray.200" />
      </HStack>

      <Button
        w="full"
        variant="outline"
        borderColor="gray.200"
        color="gray.700"
        size="lg"
        rounded="md"
        fontWeight="medium"
        leftIcon={<Icon as={FcGoogle} boxSize={5} />}
        _hover={{ bg: "gray.50", borderColor: "gray.300" }}
        transition="all 0.2s"
        onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
      >
        Continue with Google
      </Button>
    </VStack>
  );
}

// ─── Auth Page ────
export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <Flex minH="100vh" bg="#fbfaf7">

      {/* ── Left branding panel (desktop only) ── */}
      <Flex
        display={{ base: "none", lg: "flex" }}
        flex={1}
        direction="column"
        align="center"
        justify="center"
        px={16}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset={0}
          bgImage="url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop')"
          bgSize="cover"
          bgPosition="center"
          style={{ filter: "blur(1px)", transform: "scale(1.05)" }}
        />
        <Box position="absolute" inset={0} bg="rgba(30, 58, 15, 0.80)" />

        <VStack spacing={6} zIndex={1} textAlign="center" color="white" w="full" maxW="sm">
          <Flex align="center" gap={3}>
            <Icon as={FaLeaf} boxSize={10} />
            <Heading fontSize="4xl" fontWeight="extrabold" letterSpacing="tight">
              Healthy<Text as="span" color="#f2b233">Bite</Text>
            </Heading>
          </Flex>

          <Text fontSize="xl" fontWeight="medium" lineHeight="tall">
            Nutritionist-crafted meals delivered fresh to your door.
          </Text>

          <Stack spacing={4} pt={2} w="100%" textAlign="left">
            {[
              "✔  Nutritionist-approved meals",
              "✔  Affordable plans for everyone",
              "✔  No cooking or cleaning required",
            ].map((item) => (
              <Text key={item} fontSize="md" color="whiteAlpha.900">{item}</Text>
            ))}
          </Stack>

          <Box
            w="full"
            bg="whiteAlpha.200"
            border="1px solid"
            borderColor="whiteAlpha.300"
            rounded="xl"
            px={5}
            py={4}
            mt={2}
            textAlign="left"
          >
            <Text fontSize="sm" color="whiteAlpha.900" fontStyle="italic" mb={3} lineHeight="tall">
              "Before HealthyBite, I skipped meals because I had no time to cook. Now I eat better than ever — fresh, balanced, and delivered right to my door. I've never felt this energetic."
            </Text>
            <HStack spacing={2}>
              <Image
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face"
                alt="Amira K."
                w={9}
                h={9}
                rounded="full"
                objectFit="cover"
                flexShrink={0}
                border="2px solid"
                borderColor="whiteAlpha.400"
              />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" fontWeight="bold" color="white">Amira Khalid · Lagos</Text>
                <HStack spacing={1}>
                  {Array(5).fill("").map((_, i) => (
                    <Text key={i} color="#f2b233" fontSize="10px">★</Text>
                  ))}
                </HStack>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Flex>

      {/* ── Right form panel ── */}
      <Flex
        flex={{ base: 1, lg: "0 0 480px" }}
        direction="column"
        align="center"
        justify="center"
        px={{ base: 6, md: 12 }}
        py={12}
        bg="white"
      >
        <Flex
          display={{ base: "flex", lg: "none" }}
          align="center"
          gap={2}
          mb={8}
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          <Icon as={FaLeaf} color="#6b8f3f" boxSize={6} />
          <Heading fontSize="2xl" color="#6b8f3f" fontWeight="extrabold" letterSpacing="tight">
            Healthy<Text as="span" color="#f2b233">Bite</Text>
          </Heading>
        </Flex>

        <Box w="100%" maxW="400px">
          <VStack spacing={2} mb={8} align="start">
            <Heading fontSize="2xl" color="gray.800">Welcome</Heading>
            <Text color="gray.500" fontSize="sm">Sign in to your account or create a new one.</Text>
          </VStack>

          <Tabs variant="soft-rounded" colorScheme="green" isFitted>
            <TabList bg="gray.100" rounded="lg" p={1} mb={8}>
              <Tab rounded="md" fontWeight="semibold" fontSize="sm" _selected={{ bg: "white", color: "#6b8f3f", shadow: "sm" }}>
                Login
              </Tab>
              <Tab rounded="md" fontWeight="semibold" fontSize="sm" _selected={{ bg: "white", color: "#f2b233", shadow: "sm" }}>
                Sign Up
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}><LoginForm /></TabPanel>
              <TabPanel p={0}><SignUpForm /></TabPanel>
            </TabPanels>
          </Tabs>

          <Text
            mt={8}
            textAlign="center"
            fontSize="xs"
            color="gray.400"
            cursor="pointer"
            _hover={{ color: "#6b8f3f" }}
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}