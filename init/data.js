const data = [
  {
    title: "Overflowing Garbage Bin",
    description: "Garbage bin on 5th street is overflowing and attracting pests.",
    category: "Garbage",
    status: "pending",
    image: {
      url: "https://media.istockphoto.com/id/1175874693/photo/huge-garbage-piles-next-to-the-dumpster-after-city-fair-stacks-of-litter-bags-overflow-trash.jpg?s=612x612&w=0&k=20&c=91x9gxN_tT2gdSH0OQMO1q19KTFdhj56B62-dLY8tso=",
      filename: "garbage_bin_1"
    },
    location: "5th Street, Downtown",
    reporter: "6824ad2c718b04272e60d81c",
    upvotes: [],
    comments: [],
    assignedTo: null,
    created_At: new Date("2025-05-01T10:20:30Z"),
    resolved_At: null
  },
  {
    title: "Broken Street Light",
    description: "Street light not working near central park entrance.",
    category: "Street Light",
    status: "in_progress",
    image: {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOueHEXhEQDYwTCjXdJ9sGpEu1p5PlnKy2ug&s",
      filename: "street_light_1"
    },
    location: "Central Park Entrance",
    reporter: "6826ca7f201f116cd8d86bda",
    upvotes: ["6824a81925df9f3ed943fb02"],
    comments: [],
    assignedTo: null,
    created_At: new Date("2025-04-25T14:12:00Z"),
    resolved_At: null
  },
  {
    title: "Water Leak in Basement",
    description: "Persistent water leakage found in basement parking area.",
    category: "Water Leak",
    status: "resolved",
    image: {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaXlbYL6y2Y6ou4eIl-wM7rg0VSeSauw-kiA&s",
      filename: "water_leak_1"
    },
    location: "Basement Parking Lot",
    reporter: "6824a81925df9f3ed943fb02",
    upvotes: [
      "6824abb1acc4af728e2d0353",
      "6824a81925df9f3ed943fb02"
    ],
    comments: [],
    assignedTo: null,
    created_At: new Date("2025-04-10T09:30:00Z"),
    resolved_At: new Date("2025-04-15T16:00:00Z")
  },
  {
    title: "Pothole on Main Road",
    description: "Large pothole causing traffic delays on Main Road.",
    category: "Road",
    status: "pending",
    image: {
      url: "https://www.nbmcw.com/images/31-Roads/43960-Repairing-Potholes-1.webp",
      filename: "pothole_1"
    },
    location: "Main Road near City Hall",
    reporter: "6824ad2c718b04272e60d81c",
    upvotes: [],
    comments: [],
    assignedTo: null,
    created_At: new Date("2025-05-12T07:45:00Z"),
    resolved_At: null
  },
  {
    title: "Miscellaneous Issue Report",
    description: "Street vendor blocking pedestrian sidewalk.",
    category: "Other",
    status: "in_progress",
    image: {
      url: "https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2019/08/08/Pictures/_3cbc83fc-b94b-11e9-a203-e6c4ad816de5.jpg",
      filename: "street_vendor_1"
    },
    location: "7th Avenue, Market Area",
    reporter: "6826ca7f201f116cd8d86bda",
    upvotes: ["6824abb1acc4af728e2d0353"],
    comments: [],
    assignedTo: null,
    created_At: new Date("2025-05-08T11:00:00Z"),
    resolved_At: null
  }
]

module.exports = data;
