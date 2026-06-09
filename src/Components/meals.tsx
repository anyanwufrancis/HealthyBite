import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  Badge,
  useToast,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AddIcon, RepeatIcon } from "@chakra-ui/icons";

interface Meal {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  origin?: string;
}

const Meals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const fetchMeals = async (random = false) => {
    setLoading(true);
    try {
      const query = random ? "?random=true" : "";
      const res = await fetch(`http://localhost:5000/api/meals${query}`);
      const data: Meal[] = await res.json();
      setMeals(data);
    } catch (err) {
      toast({ title: "Failed to load meals", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleAddToCart = async (mealId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ title: "Please login to add to cart", status: "warning" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mealId, quantity: 1 }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Added to cart 🛒",
          status: "success",
          duration: 2000,
        });
      } else {
        toast({ title: data.message || "Failed to add to cart", status: "error" });
      }
    } catch (err) {
      toast({ title: "Something went wrong", status: "error" });
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" color="gray.800">
          Discover Global Meals
        </Heading>
        <Button
          leftIcon={<RepeatIcon />}
          colorScheme="green"
          onClick={() => {
            setRefreshing(true);
            fetchMeals(true);
          }}
          isLoading={refreshing}
        >
          Refresh Random Meals
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" py={20}>
          <Spinner size="xl" color="#6b8f3f" />
        </Flex>
      ) : (
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={6}
        >
          {meals.map((meal) => (
            <Box
              key={meal._id}
              bg="white"
              rounded="xl"
              overflow="hidden"
              boxShadow="md"
              _hover={{ transform: "translateY(-8px)", shadow: "xl" }}
              transition="all 0.3s"
            >
              <Image
                src={meal.image || "https://via.placeholder.com/300x200?text=Meal"}
                alt={meal.name}
                height="200px"
                width="100%"
                objectFit="cover"
              />

              <Box p={5}>
                <HStack justify="space-between" mb={2}>
                  {meal.category && <Badge colorScheme="green">{meal.category}</Badge>}
                  <Text fontWeight="bold" color="#6b8f3f">₦{meal.price}</Text>
                </HStack>

                <Heading size="md" mb={2} noOfLines={1}>
                  {meal.name}
                </Heading>

                {meal.description && (
                  <Text color="gray.600" fontSize="sm" noOfLines={2} mb={4}>
                    {meal.description}
                  </Text>
                )}

                <Button
                  w="full"
                  bg="#6b8f3f"
                  color="white"
                  leftIcon={<AddIcon />}
                  _hover={{ bg: "#5a7a34" }}
                  onClick={() => handleAddToCart(meal._id)}
                >
                  Add to Cart
                </Button>
              </Box>
            </Box>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Meals;