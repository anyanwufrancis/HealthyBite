import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  useToast,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface CartItem {
  meal: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}

const Cart = () => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ title: "Please login to view cart", status: "warning" });
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else {
        setCart({ items: [], total: 0 });
      }
    } catch (err) {
      toast({ title: "Failed to load cart", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (mealId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mealId, quantity: newQuantity - (cart.items.find(i => i.meal._id === mealId)?.quantity || 0) }),
      });

      if (res.ok) {
        fetchCart(); // Refresh cart
      }
    } catch (err) {
      toast({ title: "Failed to update quantity", status: "error" });
    }
  };

  const removeFromCart = async (mealId: string) => {
    // For remove, we can set quantity to 0 or implement remove endpoint later
    await updateQuantity(mealId, 0);
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    toast({
      title: "Checkout feature coming soon!",
      description: "Payment integration will be added soon.",
      status: "info",
    });
    // You can redirect to checkout page later
  };

  if (loading) {
    return (
      <Flex minH="80vh" align="center" justify="center">
        <Spinner size="xl" color="#6b8f3f" />
      </Flex>
    );
  }

  return (
    <Container maxW="5xl" py={8}>
      <Heading mb={8}>Your Cart 🛒</Heading>

      {cart.items.length === 0 ? (
        <VStack py={20} spacing={6}>
          <Text fontSize="6xl">🛍️</Text>
          <Heading size="lg">Your cart is empty</Heading>
          <Button colorScheme="green" onClick={() => navigate("/meals")}>
            Browse Meals
          </Button>
        </VStack>
      ) : (
        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Cart Items */}
          <VStack flex={2} align="stretch" spacing={4}>
            {cart.items.map((item) => (
              <Box
                key={item.meal._id}
                bg="white"
                p={5}
                rounded="xl"
                shadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <HStack spacing={6} align="start">
                  <Image
                    src={item.meal.image || "https://via.placeholder.com/100"}
                    alt={item.meal.name}
                    boxSize="100px"
                    objectFit="cover"
                    rounded="lg"
                  />

                  <VStack align="start" flex={1} spacing={1}>
                    <Heading size="md">{item.meal.name}</Heading>
                    {item.meal.description && (
                      <Text color="gray.600" noOfLines={2}>
                        {item.meal.description}
                      </Text>
                    )}
                    <Text fontWeight="bold" color="#6b8f3f">
                      ₦{item.meal.price}
                    </Text>
                  </VStack>

                  <VStack align="end">
                    <HStack>
                      <IconButton
                        aria-label="Decrease"
                        icon={<MinusIcon />}
                        size="sm"
                        onClick={() => updateQuantity(item.meal._id, item.quantity - 1)}
                      />
                      <Text fontWeight="bold" w="30px" textAlign="center">
                        {item.quantity}
                      </Text>
                      <IconButton
                        aria-label="Increase"
                        icon={<AddIcon />}
                        size="sm"
                        onClick={() => updateQuantity(item.meal._id, item.quantity + 1)}
                      />
                    </HStack>

                    <IconButton
                      aria-label="Remove"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.meal._id)}
                    />
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>

          {/* Order Summary */}
          <Box
            flex={1}
            bg="white"
            p={8}
            rounded="xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.100"
            h="fit-content"
            position="sticky"
            top="20px"
          >
            <Heading size="lg" mb={6}>
              Order Summary
            </Heading>

            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text>Subtotal</Text>
                <Text fontWeight="bold">₦{cart.total}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text>Delivery Fee</Text>
                <Text color="green.500">Free</Text>
              </HStack>

              <Divider />

              <HStack justify="space-between" fontSize="lg" fontWeight="bold">
                <Text>Total</Text>
                <Text>₦{cart.total}</Text>
              </HStack>

              <Button
                colorScheme="green"
                size="lg"
                mt={6}
                onClick={handleCheckout}
                isDisabled={cart.items.length === 0}
              >
                Proceed to Checkout
              </Button>

              <Button variant="outline" onClick={() => navigate("/meals")}>
                Continue Shopping
              </Button>
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
};

export default Cart;