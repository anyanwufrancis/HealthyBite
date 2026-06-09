import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const Links = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "#meals" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#footer" },
];

const NavLink: React.FC<{ children: React.ReactNode; href: string }> = ({
  children,
  href,
}) => (
  <Link
    href={href}
    px={4}
    py={2}
    fontSize="md"
    fontWeight="semibold"
    color="gray.700"
    rounded="md"
    position="relative"
    _hover={{ textDecoration: "none", color: "#6b8f3f" }}
    sx={{
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: "2px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "0%",
        height: "2px",
        bg: "#6b8f3f",
        borderRadius: "full",
        transition: "width 0.25s ease",
      },
      "&:hover::after": { width: "60%" },
    }}
  >
    {children}
  </Link>
);

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      {/* ── Sticky navbar ─────────────────────────────────────────────────────
          NOTE: for sticky to work, NO ancestor can have overflow:hidden.
          Remove overflowX="hidden" from the <Box> wrapping HomePage and
          instead add it per-section on each <Box> that needs it.
      ──────────────────────────────────────────────────────────────────────── */}
      <Box
        as="header"
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.100"
        position="sticky"
        top={0}
        zIndex={200}
      >
        <Flex
          maxW="7xl"
          mx="auto"
          px={{ base: 5, md: 10 }}
          h={20}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Logo */}
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <HStack spacing={2} align="center">
              <Text fontSize="xl" lineHeight={1}>🌿</Text>
              <Text fontWeight="extrabold" fontSize="2xl" color="#6b8f3f" letterSpacing="tight">
                Healthy<Text as="span" color="#f2b233">Bite</Text>
              </Text>
            </HStack>
          </Link>

          {/* Desktop nav */}
          <HStack spacing={2} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link.name} href={link.href}>{link.name}</NavLink>
            ))}
          </HStack>

          {/* Desktop CTA */}
          <Box display={{ base: "none", md: "flex" }}>
            <Box
              as="a"
              href="#meals"
              px={5}
              py={2.5}
              fontSize="md"
              fontWeight="semibold"
              color="white"
              bg="#6b8f3f"
              rounded="md"
              _hover={{ bg: "#5a7a34", textDecoration: "none" }}
              transition="background 0.2s"
            >
              Order Now
            </Box>
          </Box>

          {/* Hamburger */}
          <IconButton
            size="md"
            variant="ghost"
            icon={isOpen ? <CloseIcon w={4} h={4} /> : <HamburgerIcon w={6} h={6} />}
            aria-label="Toggle Menu"
            display={{ md: "none" }}
            color="gray.600"
            onClick={onToggle}
          />
        </Flex>
      </Box>

      {/* ── Left-slide drawer overlay (mobile only) ── */}
      {/* Backdrop */}
      <Box
        display={{ base: isOpen ? "block" : "none", md: "none" }}
        position="fixed"
        inset={0}
        bg="blackAlpha.500"
        zIndex={199}
        onClick={onToggle}
        // instant fade in via CSS
        sx={{
          animation: "fadeIn 0.18s ease",
          "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
        }}
      />

      {/* Drawer panel */}
      <Box
        display={{ base: "flex", md: "none" }}
        flexDirection="column"
        position="fixed"
        top={0}
        right={0}
        h="100vh"
        w="72"
        bg="white"
        zIndex={200}
        px={6}
        py={8}
        boxShadow="2xl"
        sx={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Drawer header */}
        <Flex justify="space-between" align="center" mb={8}>
          <HStack spacing={2}>
            <Text fontSize="lg">🌿</Text>
            <Text fontWeight="extrabold" fontSize="xl" color="#6b8f3f" letterSpacing="tight">
              Healthy<Text as="span" color="#f2b233">Bite</Text>
            </Text>
          </HStack>
          <IconButton
            size="sm"
            variant="ghost"
            icon={<CloseIcon w={3} h={3} />}
            aria-label="Close menu"
            color="gray.500"
            onClick={onToggle}
          />
        </Flex>

        {/* Drawer links */}
        <Stack spacing={1} flex={1}>
          {Links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={onToggle}
              px={4}
              py={3}
              fontSize="lg"
              fontWeight="semibold"
              color="gray.700"
              rounded="md"
              _hover={{ bg: "#f0f7e8", color: "#6b8f3f", textDecoration: "none" }}
              transition="all 0.15s"
            >
              {link.name}
            </Link>
          ))}
        </Stack>

        {/* Drawer CTA */}
        <Box
          as="a"
          href="#meals"
          onClick={onToggle}
          display="block"
          textAlign="center"
          px={4}
          py={3}
          fontSize="md"
          fontWeight="semibold"
          color="white"
          bg="#6b8f3f"
          rounded="md"
          _hover={{ bg: "#5a7a34", textDecoration: "none" }}
          transition="background 0.2s"
        >
          Order Now
        </Box>
      </Box>
    </>
  );
}