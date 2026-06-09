import { Flex, Spinner, Text } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Components/Home";
import AuthPage from "./Components/Auth";
import AuthSuccess from "./Components/AuthSuccess";
import ResetPassword from "./Components/resetpassword";
import AdminDashboard from "./Components/AdminDashboard";

function AppContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Flex
        align="center"
        justify="center"
        height="100vh"
        width="100vw"
        bg="white"
        direction="column"
        gap={6}
      >
        <Spinner
          thickness="4px"
          speed="0.85s"
          emptyColor="gray.200"
          color="#6b8f3f"
          size="xl"
        />
        <Text fontSize="lg" color="gray.600" fontWeight="medium">
          Preparing your healthy meals...
        </Text>
      </Flex>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default function App() {
  return <AppContent />;
}