export const currentUser = {
  id: "u_001",
  name: "Amara Johnson",
  email: "amara@example.com",
  role: "user",
  verificationStatus: "verified",
  ratingAverage: 4.8,
  ratingCount: 23,
};

export const pendingUser = {
  id: "u_002",
  name: "New User",
  email: "new@example.com",
  role: "user",
  verificationStatus: "pending_verification",
  ratingAverage: null,
  ratingCount: 0,
};

export const trips = [
  {
    id: "t_001",
    origin: "London",
    destination: "Lagos",
    departureDate: "2026-05-18",
    availableWeight: 12,
    traveler: {
      id: "u_101",
      name: "Daniel Okafor",
      ratingAverage: 4.9,
      verified: true,
    },
  },
  {
    id: "t_002",
    origin: "Toronto",
    destination: "Accra",
    departureDate: "2026-05-21",
    availableWeight: 8,
    traveler: {
      id: "u_102",
      name: "Maya Chen",
      ratingAverage: 4.7,
      verified: true,
    },
  },
  {
    id: "t_003",
    origin: "New York",
    destination: "Paris",
    departureDate: "2026-06-03",
    availableWeight: 15,
    traveler: {
      id: "u_103",
      name: "Lucas Martin",
      ratingAverage: 4.6,
      verified: true,
    },
  },
];

export const requests = [
  {
    id: "r_001",
    targetDestination: "Lagos",
    targetDate: "2026-05-22",
    item: "Laptop bag",
    itemWeight: 3,
    budget: 80,
    sender: {
      id: "u_201",
      name: "Sofia Mendes",
      ratingAverage: 4.8,
    },
  },
  {
    id: "r_002",
    targetDestination: "Accra",
    targetDate: "2026-05-24",
    item: "Documents envelope",
    itemWeight: 1,
    budget: 45,
    sender: {
      id: "u_202",
      name: "Kwame Boateng",
      ratingAverage: 4.9,
    },
  },
  {
    id: "r_003",
    targetDestination: "Paris",
    targetDate: "2026-06-06",
    item: "Small gift box",
    itemWeight: 2,
    budget: 60,
    sender: {
      id: "u_203",
      name: "Emma Laurent",
      ratingAverage: 4.5,
    },
  },
];

export const connections = [
  {
    id: "c_001",
    type: "trip_interest",
    status: "pending",
    listingTitle: "London → Lagos",
    message: "I need to send a laptop bag before next weekend.",
    otherUser: {
      name: "Sofia Mendes",
      role: "sender",
    },
  },
  {
    id: "c_002",
    type: "traveler_offer",
    status: "accepted",
    listingTitle: "Documents envelope to Accra",
    message: "I am flying to Accra and can carry this.",
    otherUser: {
      name: "Maya Chen",
      role: "traveler",
    },
  },
  {
    id: "c_003",
    type: "trip_interest",
    status: "rejected",
    listingTitle: "New York → Paris",
    message: "Can you carry a small gift box?",
    otherUser: {
      name: "Emma Laurent",
      role: "sender",
    },
  },
];

export const deals = [
  {
    id: "d_001",
    origin: "London",
    destination: "Lagos",
    status: "agreed",
    senderId: "u_001",
    travelerId: "u_101",
    item: "Laptop bag",
    budget: 80,
  },
  {
    id: "d_002",
    origin: "Toronto",
    destination: "Accra",
    status: "in_transit",
    senderId: "u_202",
    travelerId: "u_001",
    item: "Documents envelope",
    budget: 45,
  },
  {
    id: "d_003",
    origin: "New York",
    destination: "Paris",
    status: "delivered",
    senderId: "u_001",
    travelerId: "u_103",
    item: "Gift box",
    budget: 60,
  },
];

export const messages = [
  {
    id: "m_001",
    senderId: "u_101",
    text: "Hi! I can meet near the airport entrance at 10 AM.",
    createdAt: "2026-05-09T09:30:00.000Z",
    stage: "handover",
  },
  {
    id: "m_002",
    senderId: "u_001",
    text: "Perfect. I’ll bring the package and ID confirmation.",
    createdAt: "2026-05-09T09:32:00.000Z",
    stage: "handover",
  },
  {
    id: "m_003",
    senderId: "u_101",
    text: "Great. Please upload a photo before handover.",
    createdAt: "2026-05-09T09:33:00.000Z",
    stage: "pre_handover",
  },
];

export const adminUsers = [
  {
    id: "u_301",
    name: "Ibrahim Ali",
    email: "ibrahim@example.com",
    verificationStatus: "pending_verification",
    createdAt: "2026-05-01T12:00:00.000Z",
  },
  {
    id: "u_302",
    name: "Nora Smith",
    email: "nora@example.com",
    verificationStatus: "pending_verification",
    createdAt: "2026-05-03T12:00:00.000Z",
  },
];
