import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Flex, Spinner, Text } from "@chakra-ui/react";

export default function AuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      navigate("/auth");
    }
  }, []);

  return (
    <Flex align="center" justify="center" height="100vh" direction="column" gap={4}>
      <Spinner color="#6b8f3f" size="xl" />
      <Text color="gray.600">Signing you in...</Text>
    </Flex>
  );
}