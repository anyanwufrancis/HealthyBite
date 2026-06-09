import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
  // Collapse,
  useDisclosure,
  Skeleton,
  SkeletonText,
  Icon,
  IconButton,
  Flex,
  useToast,
  // keyframes,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Header from "./shared/header";
import Footer from "./shared/footer";
import { FaLeaf, FaRegCalendar, FaSyncAlt } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { MOCK_MEALS, type Meal } from "../data/mockMeals";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE_URL = "http://localhost:5000/api";

// ─── Animations ───────────────────────────────────────────────────────────────
// const spin = keyframes`
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// `;

// ─── Meal Skeleton (Loading State) ────────────────────────────────────────────
function MealSkeleton() {
  return (
    <Box bg="white" rounded="2xl" shadow="md" p={4}>
      <Skeleton h="200px" rounded="2xl" mb={3} />
      <Skeleton h="20px" w="70%" mb={2} />
      <SkeletonText noOfLines={2} spacing={2} mb={3} />
      <Skeleton h="24px" w="30%" mb={3} />
      <Skeleton h="40px" rounded="full" />
    </Box>
  );
}

// ─── Reusable meal card ───────────────────────────────────────────────────────
function MealCard({ title, content, price, img }: Meal) {
  const displayPrice = typeof price === "number" ? `$${price.toFixed(2)}` : price;
  return (
    <Box 
      bg="white" 
      rounded="2xl" 
      shadow="md" 
      p={4} 
      transition="all 0.3s" 
      _hover={{ transform: "translateY(-6px)", shadow: "xl" }}
    >
      <Image
        src={img}
        alt={title}
        rounded="2xl"
        w="100%"
        h="200px"
        objectFit="cover"
        mb={3}
        fallback={<Skeleton h="200px" rounded="2xl" />}
      />
      <Heading size="md" textAlign="center" mb={2} noOfLines={1}>
        {title}
      </Heading>
      <Text color="gray.600" mb={3} noOfLines={2} fontSize="sm">
        {content}
      </Text>
      <Text fontWeight="bold" color="#6b8f3f" mb={3}>
        {displayPrice}
      </Text>
      <Button
        w="full"
        bg="#f2b233"
        color="white"
        rounded="full"
        _hover={{ bg: "#e2a324" }}
      >
        Order Now
      </Button>
    </Box>
  );
}

// ─── Category Filter Component ────────────────────────────────────────────────
const categories = [
  { id: "all", label: "All Menu" },
  { id: "popular", label: "Popular" },
  { id: "vegan", label: "Vegan" },
  { id: "meat", label: "Meat" },
  { id: "seafood", label: "Seafood" },
];

function CategoryFilter({ active, onChange, isDisabled }: { active: string; onChange: (id: string) => void; isDisabled?: boolean }) {
  return (
    <HStack 
      spacing={3} 
      overflowX="auto" 
      pb={4} 
      w="full" 
      justify={{ base: "start", md: "center" }} 
      px={4} 
      sx={{ "&::-webkit-scrollbar": { display: "none" } }}
    >
      {categories.map((cat) => (
        <Button
          key={cat.id}
          size="sm"
          variant={active === cat.id ? "solid" : "outline"}
          bg={active === cat.id ? "#6b8f3f" : "transparent"}
          color={active === cat.id ? "white" : "gray.600"}
          borderColor={active === cat.id ? "#6b8f3f" : "gray.200"}
          px={6}
          rounded="full"
          onClick={() => onChange(cat.id)}
          isDisabled={isDisabled}
          _hover={{ 
            borderColor: "#6b8f3f", 
            color: active === cat.id ? "white" : "#6b8f3f",
            bg: active === cat.id ? "#5a7a34" : "whiteAlpha.500" 
          }}
          _active={{ bg: active === cat.id ? "#4a6a24" : "gray.100" }}
          whiteSpace="nowrap"
          fontWeight="semibold"
        >
          {cat.label}
        </Button>
      ))}
    </HStack>
  );
}

// ─── Wave helper ─────────────
type WaveProps = {
  d: string;
  fill: string;
  position?: "bottom" | "top";
  height?: string;
};

function Wave({ d, fill, position = "bottom", height = "120px" }: WaveProps) {
  const isBottom = position === "bottom";
  return (
    <Box
      position="absolute"
      {...(isBottom ? { bottom: 0 } : { top: 0 })}
      left={0}
      w="100%"
      overflow="hidden"
      lineHeight={0}
      h={height}
      pointerEvents="none"
    >
      <svg
        viewBox={`0 0 1440 ${parseInt(height)}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        <path d={d} fill={fill} />
      </svg>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchMeals = useCallback(async (cat: string, isShuffle = false) => {
    setLoading(true);
    try {
      // API call to backend (matches the Admin endpoint pattern)
      const url = `${API_BASE_URL}/meals?category=${cat === "all" ? "" : cat}${isShuffle ? "&shuffle=true" : ""}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error("API Offline");
      
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      console.warn("Falling back to local data. Error:", err);
      // Simulate backend behavior with local mock data
      setTimeout(() => {
        let processed = isShuffle ? [...MOCK_MEALS].sort(() => Math.random() - 0.5) : MOCK_MEALS;
        if (cat !== "all") {
          processed = processed.filter(m => 
            (m.category === cat) || 
            m.title.toLowerCase().includes(cat.toLowerCase())
          );
        }
        
        setMeals(processed.slice(0, 8));
        setLoading(false);
      }, 600);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals(activeCategory);
  }, [activeCategory, fetchMeals]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMeals(activeCategory, true);
    toast({
      title: "Menu Updated",
      description: "Fetching new meal inspirations for you.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <Box w="100%">
      <Header />

      {/* ── HERO ── */}
      <Box bg="#6b8f3f" color="white" position="relative" overflow="hidden">
        <Container maxW="100%" px={{ base: 6, md: 20 }} py={{ base: 12, md: 20 }}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 10, md: 16 }} alignItems="center">
            <VStack align="start" spacing={5}>
              <Heading fontSize={{ base: "3xl", md: "6xl" }} fontWeight="bold" lineHeight="short">
                Eat Healthy, <br /> Live Better
              </Heading>
              <Text fontSize={{ base: "md", md: "2xl" }} maxW="md">
                Nutritionist-crafted meals delivered fresh to your door.
              </Text>
              <HStack spacing={4}>
                <Button bg="#f2b233" color="white" size="lg" rounded="md" _hover={{ bg: "#e2a324" }} onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
                <Button as="a" href="#meals" variant="outline" borderColor="white" color="white" size="lg" rounded="md" _hover={{ bg: "whiteAlpha.200" }}>
                  View Menu
                </Button>
              </HStack>
            </VStack>
            <Image 
              src="https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=1200&auto=format&fit=crop" 
              alt="Healthy meal" 
              rounded="2xl" 
              w="100%" 
              maxH={{ base: "300px", md: "500px" }} 
              objectFit="cover" 
            />
          </Grid>
        </Container>
        <Wave d="M0,40 C360,90 1080,-30 1440,50 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── FEATURES ── */}
      <Box id="features" bg="#fbfaf7" py={{ base: 16, md: 20 }} position="relative">
        <Container maxW="7xl" px={{ base: 6, md: 20 }} pb={{ base: 24, md: 20 }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 12, md: 16 }}>
            <VStack spacing={5} align={{ base: "center", md: "start" }} textAlign={{ base: "center", md: "start" }}>
              <Icon as={FaLeaf} boxSize={12} color="#6b8f3f" />
              <Heading size="md">Fresh Ingredients</Heading>
              <Text color="gray.600">Only the freshest, high-quality ingredients in every meal.</Text>
            </VStack>
            <VStack spacing={5} align={{ base: "center", md: "start" }} textAlign={{ base: "center", md: "start" }}>
              <Icon as={FaRegCalendar} boxSize={12} color="#6b8f3f" />
              <Heading size="md">Flexible Plans</Heading>
              <Text color="gray.600">Choose a plan that fits your lifestyle — cancel anytime.</Text>
            </VStack>
            <VStack spacing={5} align={{ base: "center", md: "start" }} textAlign={{ base: "center", md: "start" }}>
              <Icon as={FaTruckFast} boxSize={12} color="#6b8f3f" />
              <Heading size="md">Fast Delivery</Heading>
              <Text color="gray.600">Enjoy quick and reliable delivery right to your doorstep.</Text>
            </VStack>
          </SimpleGrid>
        </Container>
        <Wave d="M0,80 C480,0 960,160 1440,80 L1440,180 L0,180 Z" fill="#f6f3ee" height="160px" />
      </Box>

      {/* ── ABOUT ── */}
      <Box id="about" bg="#f6f3ee" position="relative" pb="120px">
        <Container maxW="7xl" py={20}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={12} alignItems="center">
            <Image src="woman.png" alt="Healthy eating" rounded="2xl" w="100%" maxH="400px" objectFit="cover" />
            <VStack align="start" spacing={6}>
              <Heading>Healthy Eating Made Easy</Heading>
              <Text color="gray.600">
                Crafted by professional nutritionists and chefs to ensure you get a balanced diet without the hassle of cooking.
              </Text>
              <VStack align="start" spacing={3}>
                <HStack><Icon as={FaLeaf} color="#6b8f3f" /><Text>Nutritionist-approved meals</Text></HStack>
                <HStack><Icon as={FaLeaf} color="#6b8f3f" /><Text>Affordable plans for everyone</Text></HStack>
                <HStack><Icon as={FaLeaf} color="#6b8f3f" /><Text>No cooking or cleaning required</Text></HStack>
              </VStack>
              <Button bg="#6b8f3f" color="white" rounded="full" px={8} _hover={{ bg: "#5a7a34" }}>
                Learn More
              </Button>
            </VStack>
          </Grid>
        </Container>
        <Wave d="M0,40 C360,80 1080,0 1440,60 L1440,120 L0,120 Z" fill="#fbfaf7" />
      </Box>

      {/* ── MEALS (Dynamic) ── */}
      <Box id="meals" py={24} position="relative" bg="#fbfaf7">
        <Wave d="M0,80 C360,20 1080,120 1440,60 L1440,0 L0,0 Z" fill="#e4c56a" position="top" height="120px" />
        
        <Container maxW="7xl" position="relative" zIndex={10}>
          <VStack spacing={12}>
            <VStack spacing={3} textAlign="center">
              <Heading size="2xl">Explore Our World Menu</Heading>
              <Text color="gray.600" fontSize="lg" maxW="2xl">
                Discover a variety of healthy, fresh meals from across the globe.
              </Text>
            </VStack>

            {/* Filter and Shuffle Controls */}
            <VStack spacing={8} w="full">
              <Flex w="full" align="center" justify="center" direction={{ base: "column", md: "row" }} gap={4}>
                <CategoryFilter active={activeCategory} onChange={setActiveCategory} isDisabled={loading} />
                <IconButton
                  aria-label="Refresh Menu"
                  icon={<FaSyncAlt style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }} />}
                  onClick={handleRefresh}
                  isLoading={isRefreshing}
                  rounded="full"
                  bg="white"
                  shadow="sm"
                  color="#6b8f3f"
                  _hover={{ bg: "#f0f7e8" }}
                  ml={{ md: 4 }}
                />
              </Flex>
            </VStack>

            {/* Meals Display */}
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={10} w="100%">
              {loading
                ? Array(8).fill(0).map((_, i) => <MealSkeleton key={i} />)
                : meals.map((meal, index) => <MealCard key={meal._id || index} {...meal} />)
              }
            </SimpleGrid>

            {/* Empty State */}
            {!loading && meals.length === 0 && (
              <VStack py={20} spacing={6}>
                <Icon as={FaLeaf} boxSize={16} color="gray.200" />
                <Text color="gray.500" fontSize="xl" fontWeight="medium">No meals found in this category.</Text>
                <Button variant="outline" borderColor="#6b8f3f" color="#6b8f3f" onClick={() => setActiveCategory("all")}>
                  Clear Filters
                </Button>
              </VStack>
            )}

            {!loading && meals.length > 0 && (
              <Button
                bg="#6b8f3f"
                color="white"
                rounded="full"
                px={12}
                py={7}
                fontSize="lg"
                onClick={onToggle}
                _hover={{ bg: "#5a7a34", transform: "translateY(-2px)", shadow: "lg" }}
              >
                {isOpen ? "Show Less" : "View Full Menu"}
              </Button>
            )}
          </VStack>
        </Container>

        <Wave
          d="M0,60 C360,120 1080,0 1440,70 L1440,140 L0,140 Z"
          fill="#e4c56a"
          height="140px"
        />
      </Box>

      <Footer />
    </Box>
  );
}
