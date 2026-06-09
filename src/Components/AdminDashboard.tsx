import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaSignOutAlt,
  FaTrash,
  FaUser,
  FaUtensils,
  FaEdit,
  FaPlus,
} from "react-icons/fa";

interface Meal {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  origin?: string;
}

const API_MEALS = "http://localhost:5000/api/meals";

const AdminDashboard = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<"overview" | "meals">("meals"); // Simplified for now
  const navigate = useNavigate();
  const toast = useToast();

  // Meal Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [mealForm, setMealForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    origin: "",
  });

  const getAuthHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_MEALS);
      const data: Meal[] = await res.json();
      setMeals(data);
    } catch (err) {
      toast({ title: "Failed to fetch meals", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleSaveMeal = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ title: "Please login as admin", status: "error" });
      return;
    }

    const method = editingMeal ? "PUT" : "POST";
    const url = editingMeal 
      ? `${API_MEALS}/${editingMeal._id}` 
      : API_MEALS;

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeader(),
        body: JSON.stringify({
          ...mealForm,
          price: Number(mealForm.price),
        }),
      });

      if (res.ok) {
        toast({
          title: editingMeal ? "Meal updated successfully" : "Meal added successfully",
          status: "success",
        });
        fetchMeals();
        onClose();
        setEditingMeal(null);
        setMealForm({ name: "", description: "", price: "", image: "", category: "", origin: "" });
      } else {
        const data = await res.json();
        toast({ title: data.message || "Failed to save", status: "error" });
      }
    } catch (err) {
      toast({ title: "Something went wrong", status: "error" });
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!confirm("Delete this meal?")) return;

    try {
      const res = await fetch(`${API_MEALS}/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (res.ok) {
        toast({ title: "Meal deleted", status: "success" });
        fetchMeals();
      }
    } catch (err) {
      toast({ title: "Failed to delete meal", status: "error" });
    }
  };

  const openEditModal = (meal: Meal) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      description: meal.description || "",
      price: meal.price.toString(),
      image: meal.image || "",
      category: meal.category || "",
      origin: meal.origin || "",
    });
    onOpen();
  };

  return (
    <Flex minH="100vh" bg="#f7f8fa">
      {/* Sidebar */}
      <Box w={{ base: "70px", md: "240px" }} bg="#1e3a0f" color="white" p={6}>
        <HStack mb={10}>
          <Icon as={FaLeaf} color="#f2b233" boxSize={6} />
          <Text fontWeight="bold" fontSize="lg">HealthyBite</Text>
        </HStack>

        <VStack align="stretch" spacing={2}>
          <Button
            leftIcon={<FaUtensils />}
            bg={section === "meals" ? "whiteAlpha.200" : "transparent"}
            justifyContent="flex-start"
            onClick={() => setSection("meals")}
            color="white"
          >
            Manage Meals
          </Button>
        </VStack>

        <Button
          mt="auto"
          position="absolute"
          bottom={6}
          left={6}
          variant="ghost"
          color="whiteAlpha.700"
          leftIcon={<FaSignOutAlt />}
          onClick={() => navigate("/")}
        >
          Back to Site
        </Button>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={8}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading>Admin Dashboard</Heading>
          <HStack>
            <Avatar size="sm" bg="#6b8f3f" />
            <Text fontWeight="medium">Admin</Text>
          </HStack>
        </Flex>

        <Button
          leftIcon={<FaPlus />}
          colorScheme="green"
          mb={6}
          onClick={() => {
            setEditingMeal(null);
            setMealForm({ name: "", description: "", price: "", image: "", category: "", origin: "" });
            onOpen();
          }}
        >
          Add New Meal
        </Button>

        {loading ? (
          <Spinner size="xl" />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {meals.map((meal) => (
              <Box
                key={meal._id}
                bg="white"
                rounded="xl"
                shadow="sm"
                overflow="hidden"
                border="1px solid"
                borderColor="gray.100"
              >
                <Image
                  src={meal.image || "https://via.placeholder.com/400x200"}
                  alt={meal.name}
                  height="160px"
                  width="100%"
                  objectFit="cover"
                />
                <Box p={4}>
                  <Heading size="md" mb={2}>{meal.name}</Heading>
                  <Text color="gray.600" noOfLines={2} mb={3}>
                    {meal.description}
                  </Text>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" color="#6b8f3f">₦{meal.price}</Text>
                    <HStack>
                      <IconButton
                        aria-label="Edit"
                        icon={<FaEdit />}
                        size="sm"
                        onClick={() => openEditModal(meal)}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteMeal(meal._id)}
                      />
                    </HStack>
                  </HStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* Add/Edit Meal Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingMeal ? "Edit Meal" : "Add New Meal"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Meal Name</FormLabel>
                <Input
                  value={mealForm.name}
                  onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={mealForm.description}
                  onChange={(e) => setMealForm({ ...mealForm, description: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price (₦)</FormLabel>
                <Input
                  type="number"
                  value={mealForm.price}
                  onChange={(e) => setMealForm({ ...mealForm, price: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={mealForm.image}
                  onChange={(e) => setMealForm({ ...mealForm, image: e.target.value })}
                />
              </FormControl>

              <HStack w="full">
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Input
                    value={mealForm.category}
                    onChange={(e) => setMealForm({ ...mealForm, category: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Origin</FormLabel>
                  <Input
                    value={mealForm.origin}
                    onChange={(e) => setMealForm({ ...mealForm, origin: e.target.value })}
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSaveMeal}>
              {editingMeal ? "Update Meal" : "Add Meal"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default AdminDashboard;