import {
  Box,
  Container,
  Text,
  Link,
  SimpleGrid,
  Input,
  Button,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaInstagram, FaXTwitter, FaFacebook } from "react-icons/fa6";

// ─── Types ────
interface FooterLinkProps {
  children: React.ReactNode;
  href?: string;
}

// ─── Sub-components ──
const FooterLink: React.FC<FooterLinkProps> = ({ children, href = "#" }) => (
  <Link
    href={href}
    fontSize="sm"
    color="whiteAlpha.800"
    _hover={{ color: "white", textDecoration: "none", pl: 1 }}
    transition="all 0.2s"
  >
    {children}
  </Link>
);

const SocialButton = ({
  icon,
  label,
  href = "#",
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
}) => (
  <Link
    href={href}
    aria-label={label}
    display="flex"
    alignItems="center"
    justifyContent="center"
    w={9}
    h={9}
    rounded="full"
    bg="whiteAlpha.200"
    color="white"
    fontSize="lg"
    _hover={{ bg: "#f2b233", transform: "translateY(-2px)" }}
    transition="all 0.2s"
  >
    {icon}
  </Link>
);

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Please enter a valid email.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    // Simulate subscription — replace with your real API call
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);

    toast({
      title: "You're subscribed! 🎉",
      description: "Expect healthy tips and exclusive deals in your inbox.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    setEmail("");
  };

  return (
    <Box id="footer" bg="#3b5c1f" color="white">
      {/* ── Main footer content ── */}
      <Container maxW="7xl" py={{ base: 12, md: 16 }} px={{ base: 6, md: 20 }}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 10, md: 8 }}>

          {/* Brand column */}
          <VStack align="start" spacing={4}>
            <Text fontSize="2xl" fontWeight="extrabold" letterSpacing="tight">
              🌿 HealthyBite
            </Text>
            <Text fontSize="sm" color="whiteAlpha.800" lineHeight="tall" maxW="xs">
              Nutritionist-crafted meals delivered fresh to your door. Eating
              well has never been this effortless.
            </Text>
            <HStack spacing={3} pt={1}>
              <SocialButton icon={<FaInstagram />} label="Instagram" />
              <SocialButton icon={<FaXTwitter />} label="X / Twitter" />
              <SocialButton icon={<FaFacebook />} label="Facebook" />
            </HStack>
          </VStack>

          {/* Company links */}
          <VStack align="start" spacing={3}>
            <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="widest" color="whiteAlpha.600" mb={1}>
              Company
            </Text>
            <FooterLink href="#about">About Us</FooterLink>
            <FooterLink href="#meals">Our Menu</FooterLink>
            <FooterLink href="#features">How It Works</FooterLink>
            <FooterLink>Careers</FooterLink>
            <FooterLink>Blog</FooterLink>
          </VStack>

          {/* Support links */}
          <VStack align="start" spacing={3}>
            <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="widest" color="whiteAlpha.600" mb={1}>
              Support
            </Text>
            <FooterLink>FAQ</FooterLink>
            <FooterLink>Help Center</FooterLink>
            <FooterLink>Privacy Policy</FooterLink>
            <FooterLink>Terms of Service</FooterLink>
            <FooterLink>Refund Policy</FooterLink>
          </VStack>

          {/* Newsletter column */}
          <VStack align="start" spacing={4}>
            <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="widest" color="whiteAlpha.600">
              Stay in the loop
            </Text>
            <Text fontSize="sm" color="whiteAlpha.800" lineHeight="tall">
              Get weekly healthy recipes, meal tips, and exclusive subscriber
              discounts — straight to your inbox.
            </Text>
            <VStack spacing={2} w="100%">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.300"
                color="white"
                _placeholder={{ color: "whiteAlpha.500" }}
                _hover={{ borderColor: "whiteAlpha.500" }}
                _focus={{ borderColor: "#f2b233", boxShadow: "0 0 0 1px #f2b233" }}
                rounded="md"
                size="sm"
              />
              <Button
                w="full"
                bg="#f2b233"
                color="white"
                size="sm"
                rounded="md"
                isLoading={loading}
                loadingText="Subscribing…"
                onClick={handleSubscribe}
                _hover={{ bg: "#e2a324", transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Subscribe for free
              </Button>
            </VStack>
            <Text fontSize="xs" color="whiteAlpha.500">
              No spam. Unsubscribe anytime.
            </Text>
          </VStack>
        </SimpleGrid>
      </Container>

      {/* ── Bottom bar ── */}
      <Box borderTop="1px solid" borderColor="whiteAlpha.200">
        <Container maxW="7xl" py={4} px={{ base: 6, md: 20 }}>
          <SimpleGrid columns={{ base: 1, md: 2 }} alignItems="center" gap={2}>
            <Text fontSize="xs" color="whiteAlpha.600">
              © {new Date().getFullYear()} HealthyBite. All rights reserved.
            </Text>
            <HStack
              spacing={4}
              justify={{ base: "start", md: "end" }}
              fontSize="xs"
              color="whiteAlpha.600"
            >
              <Link href="#" _hover={{ color: "white" }}>Privacy</Link>
              <Text>·</Text>
              <Link href="#" _hover={{ color: "white" }}>Terms</Link>
              <Text>·</Text>
              <Link href="#" _hover={{ color: "white" }}>Cookies</Link>
            </HStack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}