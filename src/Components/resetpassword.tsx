import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLeaf, FaCheckCircle, FaLock } from "react-icons/fa";

// ─── Password strength helper ───────────────────────────────────────────────
type Strength = "weak" | "fair" | "strong";

function getStrength(pwd: string): Strength {
  if (pwd.length < 6) return "weak";
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasDigit = /[0-9]/.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
  const varietyCount = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;
  if (pwd.length >= 8 && varietyCount >= 3) return "strong";
  return "fair";
}

const strengthConfig: Record<Strength, { label: string; color: string; segments: number }> = {
  weak:   { label: "Weak",   color: "#e53e3e", segments: 1 },
  fair:   { label: "Fair",   color: "#f2b233", segments: 2 },
  strong: { label: "Strong", color: "#6b8f3f", segments: 3 },
};

function StrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const strength = getStrength(password);
  const { label, color, segments } = strengthConfig[strength];

  return (
    <Box w="full" mt={2}>
      <HStack spacing={1.5} mb={1}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            flex={1}
            h="3px"
            rounded="full"
            bg={i <= segments ? color : "gray.200"}
            transition="background 0.25s"
          />
        ))}
      </HStack>
      <Text fontSize="xs" color={color} fontWeight="semibold" transition="color 0.25s">
        {label}
      </Text>
    </Box>
  );
}

// ─── Password input with show/hide toggle ────────────────────────────────────
function PasswordInput({
  placeholder = "Enter new password",
  value,
  onChange,
  onKeyDown,
  isInvalid,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  isInvalid?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <InputGroup>
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        isInvalid={isInvalid}
        bg="gray.50"
        border="1px solid"
        borderColor={isInvalid ? "red.400" : "gray.200"}
        _hover={{ borderColor: isInvalid ? "red.400" : "#6b8f3f" }}
        _focus={{ borderColor: isInvalid ? "red.400" : "#6b8f3f", boxShadow: isInvalid ? "0 0 0 1px #e53e3e" : "0 0 0 1px #6b8f3f" }}
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

// ─── Success state ───────────────────────────────────────────────────────────
function SuccessView({ onGoToLogin }: { onGoToLogin: () => void }) {
  return (
    <VStack spacing={6} py={4} textAlign="center">
      <Flex
        w={16}
        h={16}
        rounded="full"
        bg="#f0f7e8"
        align="center"
        justify="center"
        mx="auto"
      >
        <Icon as={FaCheckCircle} color="#6b8f3f" boxSize={8} />
      </Flex>

      <VStack spacing={2}>
        <Heading fontSize="xl" color="gray.800">Password reset!</Heading>
        <Text fontSize="sm" color="gray.500" lineHeight="tall" maxW="xs">
          You can now sign in with your new password.
        </Text>
      </VStack>

      <Button
        w="full"
        bg="#6b8f3f"
        color="white"
        size="lg"
        rounded="md"
        _hover={{ bg: "#5a7a34" }}
        transition="background 0.2s"
        onClick={onGoToLogin}
      >
        Go to Login
      </Button>
    </VStack>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [params] = useSearchParams();
  const toast = useToast();
  const navigate = useNavigate();
  const token = params.get("token");

  const confirmMismatch = confirm.length > 0 && confirm !== password;

  const handleReset = useCallback(async () => {
    if (!password || !confirm) {
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
    if (!token) {
      toast({ title: "Invalid or missing reset token.", status: "error", duration: 3000, isClosable: true });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
    } catch (err: any) {
      toast({ title: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  }, [password, confirm, token, toast]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleReset();
  };

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
        <Box w="100%" maxW="400px">

          {/* Logo */}
          <Flex
            align="center"
            gap={2}
            mb={10}
            cursor="pointer"
            onClick={() => navigate("/")}
            w="fit-content"
          >
            <Icon as={FaLeaf} color="#6b8f3f" boxSize={5} />
            <Text fontWeight="extrabold" fontSize="xl" color="#6b8f3f" letterSpacing="tight">
              Healthy<Text as="span" color="#f2b233">Bite</Text>
            </Text>
          </Flex>

          {success ? (
            <SuccessView onGoToLogin={() => navigate("/auth")} />
          ) : (
            <>
              {/* Header */}
              <VStack align="start" spacing={1} mb={8}>
                <Flex align="center" gap={2}>
                  <Flex
                    w={9}
                    h={9}
                    rounded="lg"
                    bg="#f0f7e8"
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <Icon as={FaLock} color="#6b8f3f" boxSize={4} />
                  </Flex>
                  <Heading fontSize="2xl" color="gray.800">Set new password</Heading>
                </Flex>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Must be at least 6 characters. Mix letters, numbers and symbols for a stronger password.
                </Text>
              </VStack>

              {/* Form */}
              <VStack
                spacing={5}
                as="form"
                onSubmit={(e) => { e.preventDefault(); handleReset(); }}
              >
                {/* New password */}
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                    New password
                  </FormLabel>
                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    onKeyDown={handleKeyDown}
                  />
                  <StrengthBar password={password} />
                </FormControl>

                {/* Confirm password */}
                <FormControl isRequired isInvalid={confirmMismatch}>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                    Confirm password
                  </FormLabel>
                  <PasswordInput
                    placeholder="Re-enter new password"
                    value={confirm}
                    onChange={setConfirm}
                    onKeyDown={handleKeyDown}
                    isInvalid={confirmMismatch}
                  />
                  {confirmMismatch && (
                    <FormErrorMessage fontSize="xs">Passwords do not match.</FormErrorMessage>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  w="full"
                  bg="#6b8f3f"
                  color="white"
                  size="lg"
                  rounded="md"
                  isLoading={loading}
                  loadingText="Resetting…"
                  isDisabled={confirmMismatch}
                  _hover={{ bg: "#5a7a34" }}
                  _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                  transition="background 0.2s"
                  mt={1}
                >
                  Reset Password
                </Button>
              </VStack>

              {/* Back link */}
              <Text
                mt={6}
                textAlign="center"
                fontSize="xs"
                color="gray.400"
                cursor="pointer"
                _hover={{ color: "#6b8f3f" }}
                transition="color 0.2s"
                onClick={() => navigate("/auth")}
              >
                ← Back to Login
              </Text>
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
