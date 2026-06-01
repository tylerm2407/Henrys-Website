export interface Project {
  id: string;
  title: string;
  category: "highlight-reels" | "video-edits" | "photography" | "commercial" | "custom";
  categoryLabel: string;
  year: number;
  thumbnail: string;
  videoUrl?: string;
  videos?: string[];
  images?: string[];
  description: string;
  featured: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  formValue: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  service: string;
  projectId?: string;
}

export const projects: Project[] = [
  {
    id: "penn-state",
    title: "Penn State",
    category: "highlight-reels",
    categoryLabel: "Highlight Reels",
    year: 2025,
    thumbnail: "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/795977ec-ebe6-445a-b47c-cf64fa16ae1e_rwc_49x0x1827x1030x32.jpg",
    videoUrl: "/videos/hero-reel.mp4",
    videos: ["/videos/hero-reel.mp4", "/videos/showreel.mp4"],
    images: [
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/d4f56a4e-3716-456d-bea7-154e59cac2ec_rw_1920.jpg",
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/1cdfbacd-227e-416a-a73f-d00f41434bbb_rw_1920.jpg",
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/b44c5a42-1e87-4450-9b27-0ca44d03735c_rw_1920.jpg",
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/ca6649af-7f8a-49a8-8d85-6ea4cc507b6a_rw_1920.jpg",
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/3742ed3f-2fac-4746-bd05-940f00bc2ecf_rw_1920.jpg",
    ],
    description: "Sports videography and photography capturing Penn State athletics in action.",
    featured: true,
  },
  {
    id: "lake-of-isles",
    title: "Lake of Isles",
    category: "commercial",
    categoryLabel: "Commercial",
    year: 2025,
    thumbnail: "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/f25524f5-92d5-4f1e-8c2a-8294c350e639_rwc_0x0x5255x2962x32.jpg",
    videoUrl: "/videos/lake-of-isles.mp4",
    description: "Commercial videography for Lake of Isles golf course, capturing the beauty of the course and its atmosphere.",
    featured: true,
  },
  {
    id: "east-lyme",
    title: "East Lyme",
    category: "photography",
    categoryLabel: "Photography",
    year: 2024,
    thumbnail: "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/ebd0eec2-b22b-492e-97aa-c4f4610d093a_rwc_0x0x1916x1080x32.jpg",
    videoUrl: "",
    images: [
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/4f8c2374-09b7-4057-a19f-22780b9ad66d_rw_1920.jpg",
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/26030b8b-d126-40f7-a592-cd3a9d8fcecd_rw_1920.JPG",
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/9e1140fc-f620-4780-9935-564054aa2042_rw_1920.JPG",
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/ea723cf1-ab38-47df-a221-169fc9f17062_rw_1920.JPG",
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/4dc990ba-9272-4f05-a49c-5dc32116c5cf_rw_1920.jpg",
      "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/52c0ed1e-27eb-48a1-86c4-73871b9a5915_rw_1920.JPG",
    ],
    description: "A photography collection capturing the landscapes, people, and atmosphere of East Lyme, Connecticut.",
    featured: false,
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    category: "custom",
    categoryLabel: "Custom",
    year: 2024,
    thumbnail: "https://cdn.myportfolio.com/5331aa8c-4c0f-4b1c-8825-333d59d0f6b0/9708a6d5-af42-49d5-9adb-dd19c5d6b5bf_rwc_0x245x1000x563x32.JPG",
    description: "Graphic design projects including branding, promotional materials, and digital assets.",
    featured: false,
  },
];

export const services: Service[] = [
  {
    id: "highlight-reels",
    title: "Highlight Reels",
    description: "Dynamic highlight reels that capture your best moments and showcase your talent to coaches, recruiters, and fans.",
    icon: "Film",
    formValue: "Highlight Reel",
  },
  {
    id: "video-edits",
    title: "Video Edits",
    description: "Professional video editing that transforms raw footage into polished, compelling stories.",
    icon: "Clapperboard",
    formValue: "Video Edit",
  },
  {
    id: "photography",
    title: "Photography & Portraits",
    description: "High-quality photography and portraits that capture authentic moments and create lasting impressions.",
    icon: "Camera",
    formValue: "Photography / Portraits",
  },
  {
    id: "commercial",
    title: "Commercial & Business",
    description: "Professional video content for businesses, from promotional videos to brand storytelling.",
    icon: "Building2",
    formValue: "Commercial / Business Video",
  },
  {
    id: "custom",
    title: "Custom Projects",
    description: "Have something unique in mind? Let's collaborate to bring your creative vision to life.",
    icon: "Sparkles",
    formValue: "Custom Request",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "Henry captured our season perfectly. The highlight reel helped our players get noticed by college recruiters.",
    clientName: "Sample Client",
    service: "Highlight Reels",
    projectId: "penn-state",
  },
  {
    id: "2",
    quote: "The commercial video exceeded our expectations. Professional quality that truly represented our brand.",
    clientName: "Sample Client",
    service: "Commercial & Business",
    projectId: "lake-of-isles",
  },
  {
    id: "3",
    quote: "Incredible eye for detail and composition. The portraits came out better than we could have imagined.",
    clientName: "Sample Client",
    service: "Photography & Portraits",
  },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
];

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/gannoemedia/", icon: "Instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@henrygannoe", icon: "TikTok" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/henry-gannoe-513017252", icon: "Linkedin" },
];

export const categories = [
  { value: "all", label: "All" },
  { value: "highlight-reels", label: "Highlight Reels" },
  { value: "video-edits", label: "Video Edits" },
  { value: "photography", label: "Photography" },
  { value: "commercial", label: "Commercial" },
  { value: "custom", label: "Custom" },
];
