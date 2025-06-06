import Pets from "@/assets/home/hero/pets.png";

import Cat from "@/assets/home/about/cat.png";

import Veterinary from "@/assets/home/hero/veterinary-dog.svg";
import PetCare from "@/assets/home/hero/pet-care.svg";
import DogAndCat from "@/assets/home/hero/dog-and-cat.svg";

import Sarah from "@/assets/home/our-team/sarah.jpg";
import Michael from "@/assets/home/our-team/michael.jpeg";
import Vanessa from "@/assets/home/our-team/vanessa.jpg";

import PawPrint from "@/assets/home/navbar/paw.png";

export type IconName =
  | "FaFacebookF"
  | "FaInstagram"
  | "FaXTwitter"
  | "FaYoutube";

export const HERO = {
  image: Pets,
  alt: "Dog and cat",
  title: <>Premium Care for Pets You Love</>,
  description: (
    <>
      From gentle grooming to premium supplies, we make your pet feel safe,
      clean, and truly loved.
    </>
  ),
};

export const ABOUT = {
  image: Cat,
  alt: "Cat",
  title: "About us",
  subtitle: "The Best Service",
  texts: [
    "At Pawfaction, we believe that every pet deserves exceptional care, love, and attention. That’s why we’ve created a welcoming space where your furry companions can thrive, whether they’re here for a quick visit or an extended stay.",
    "Our services are designed with your pet’s well-being in mind. With a dedicated team of professionals and a passion for animals, Pawfaction is more than a service, it’s a second home for your pet.",
  ],
};

export const OUR_SERVICE = {
  title: "Our Service",
  subtitle: "How Does It Work",
  services: [
    {
      image: Veterinary,
      alt: "Service 1",
      title: "Book Your Visit",
      description:
        "Choose your services and time slot in our quick online scheduler.",
    },
    {
      image: PetCare,
      alt: "Service 2",
      title: "Expert Care",
      description:
        "Our certified team welcomes your pet with a warm meet-and-greet.",
    },
    {
      image: DogAndCat,
      alt: "Service 3",
      title: "Happy Pickup",
      description:
        "Get real-time updates and pick up your happy, healthy companion.",
    },
  ],
};

export const OUR_REVIEWS = {
  titles: {
    main: "Our Reviews",
    subtitle: "What They Say?",
  },
  reviewsList: [
    {
      name: "Milo Bennett",
      username: "@milo.b",
      body: "They treated my pup with so much care and attention. I couldn’t ask for better!",
      img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png",
    },
    {
      name: "Luna Harper",
      username: "@lunah",
      body: "My dog came home happy, calm, and clearly well cared for. Highly recommend!",
      img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_2.png",
    },
    {
      name: "Theo Lang",
      username: "@theolang",
      body: "The trainers are patient, professional, and truly love animals.",
      img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png",
    },
    {
      name: "Zara Quinn",
      username: "@zquinn",
      body: "I brought my cat in for a hygienic care session, and they did an incredible job!",
      img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_9.png",
    },
    {
      name: "Jenny",
      username: "@jenny",
      body: "The Daycare and grooming services are top-notch.",
      img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_10.png",
    },
    {
      name: "Finn Dawson",
      username: "@finnd",
      body: "From training to health checkups, every service we’ve tried has been incredible.",
      img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_14.png",
    },
  ],
};

export const OUR_TEAM = [
  {
    name: "Sarah Washington",
    role: "Healthcare, Training",
    img: Sarah,
    bg: "bg-yellow-400",
  },
  {
    name: "Michael Ferguson",
    role: "Daycare, Healthcare, Hygienic Care",
    img: Michael,
    bg: "bg-cyan-400",
  },
  {
    name: "Vanessa Maddox",
    role: "Training, Daycare",
    img: Vanessa,
    bg: "bg-rose-400",
  },
];

export const OUR_NEWS = {
  titles: {
    main: "Our News & Promotions",
    subtitle: "Join Our Newsletter",
  },
  description:
    "Be the first to know about exclusive deals, pet care tips and more.\nSign up for free and stay connected!",
  placeholders: {
    emailInput: "Enter your email address",
  },
  messages: {
    success: "Thank you for subscribing!",
    invalidEmail: "Please enter a valid email address.",
    genericError: "Something went wrong. Please try again.",
    submitting: "Submitting...",
    subscribeButton: "Subscribe",
  },
};

export const FOOTER = {
  logo: {
    src: PawPrint,
    alt: "Paw Icon",
    brandName: "Pawfaction",
    slogan: "Every pawprint matters.",
  },
  sections: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      title: "Useful Links",
      links: [
        { label: "Discount", href: "#" },
        { label: "F.A.Q", href: "#" },
      ],
    },
    {
      title: "Customer Service",
      links: [{ label: "Contact Us", href: "#" }],
    },
  ],
  socialMediaTitle: "Follow Us",
  socialMedia: [
    { label: "Facebook", href: "#", iconName: "FaFacebookF" },
    { label: "Instagram", href: "#", iconName: "FaInstagram" },
    { label: "YouTube", href: "#", iconName: "FaYoutube" },
    { label: "X", href: "#", iconName: "FaXTwitter" },
  ],
  copyright: {
    year: 2025,
    text: "Design by",
    author: "malu-monteiro",
    authorLink: "https://github.com/malu-monteiro",
  },
};
