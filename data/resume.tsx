import { Icons } from "@/components/icons";
import {
  HomeIcon,
  NotebookPen,
  BookOpenCheck,
  Camera,
  Music,
  FileText,
  FolderGit2,
  LayoutGrid,
  History,
  Globe2,
} from "lucide-react";

import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Java } from "@/components/ui/svgs/java";
import { Cplusplus } from "@/components/ui/svgs/cplusplus";

export const DATA = {
  name: "Dhruv Agrawat",
  initials: "DA",
  url: "https://dhruvagrawat.com",
  location: "New Delhi, India",
  locationLink: "https://www.google.com/maps/place/New+Delhi,+Delhi,+India",

  description:
    "Full-Stack Software Engineer, Freelancer, and Startup Builder focused on building scalable web products.",

  summary:
    "I am a Full-Stack Software Engineer with 3+ years of hands-on experience building web applications, automation tools, and startup products. I’ve worked across freelance, startup, and agency environments, contributing to scalable systems using React, Next.js, Node.js, and modern cloud tooling. I also co-founded a tech agency and actively mentor developers.",

  // Served from GitHub until a local /public/me.png is added.
  avatarUrl: "https://github.com/dhruvagrawat.png",

  skills: [
    { name: "React", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Typescript", icon: Typescript },
    { name: "Node.js", icon: Nodejs },
    { name: "Python", icon: Python },
    { name: "PostgreSQL", icon: Postgresql },
    { name: "Docker", icon: Docker },
    { name: "Java", icon: Java },
    { name: "C++", icon: Cplusplus },
  ],

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blogs", icon: NotebookPen, label: "Blogs" },
    { href: "/articles", icon: FileText, label: "Articles" },
    { href: "/resipy", icon: BookOpenCheck, label: "Resipy" },
    { href: "/photography", icon: Camera, label: "Photography" },
    { href: "/travel", icon: Globe2, label: "Travel" },
    { href: "/music", icon: Music, label: "Music" },
    { href: "/projects", icon: FolderGit2, label: "Projects" },
    { href: "/tools", icon: LayoutGrid, label: "More" },
    { href: "/1999", icon: History, label: "Go Back in Time" },
  ],

  contact: {
    email: "agrawatdhruv@gmail.com",
    tel: "+91 920-5252-966",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/dhruvagrawat",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/dhruvagrawat/",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/DhruvAgrawat",
        icon: Icons.x,
        navbar: true,
      },
      // Other profiles (from github.com/dhruvagrawat) — not shown in the dock,
      // but listed in structured data so search engines know they're the same person.
      Instagram: {
        name: "Instagram",
        url: "https://www.instagram.com/dhruvagrawat/",
        icon: Icons.globe,
        navbar: false,
      },
      LeetCode: {
        name: "LeetCode",
        url: "https://leetcode.com/dhruvagrawat/",
        icon: Icons.globe,
        navbar: false,
      },
      GeeksforGeeks: {
        name: "GeeksforGeeks",
        url: "https://auth.geeksforgeeks.org/user/dhruvagrawat",
        icon: Icons.globe,
        navbar: false,
      },
      email: {
        name: "Send Email",
        url: "mailto:agrawatdhruv@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Quadcydle",
      href: "https://quadcydle.com",
      badges: ["Co-Founder"],
      location: "New Delhi, India",
      title: "Co-Founder & Software Engineer",
      logoUrl: "",
      start: "June 2023",
      end: "Present",
      description:
        "Co-founded a technology agency focused on building digital solutions for small and remote businesses. Led full-stack development, hiring, mentoring, and delivery of scalable web applications.",
    },
    {
      company: "CData Insights",
      href: "",
      badges: [],
      location: "Remote (USA)",
      title: "Software Engineer",
      logoUrl: "",
      start: "January 2025",
      end: "April 2025",
      description:
        "Worked on backend-heavy software systems and contributed to scalable engineering solutions for enterprise use cases.",
    },
    {
      company: "LiveBuy",
      href: "",
      badges: [],
      location: "New Delhi, India",
      title: "Software Engineer",
      logoUrl: "",
      start: "November 2024",
      end: "January 2025",
      description:
        "Built and maintained production features for a commerce platform, working across frontend and backend systems.",
    },
    {
      company: "TICKET'D",
      href: "",
      badges: [],
      location: "Gurugram, India",
      title: "Software Developer",
      logoUrl: "",
      start: "May 2024",
      end: "October 2024",
      description:
        "Worked on a Web3-based ticketing platform, contributing to product features, integrations, and performance optimization.",
    },
    {
      company: "Freelance",
      href: "",
      badges: ["Self-Employed"],
      location: "Remote",
      title: "Freelance Full-Stack Developer",
      logoUrl: "",
      start: "January 2023",
      end: "Present",
      description:
        "Delivered 30+ custom web applications using Next.js, Node.js, MongoDB, and PostgreSQL. Improved performance, responsiveness, and scalability for multiple clients.",
    },
    {
      company: "Alonefield LLC",
      href: "",
      badges: [],
      location: "Remote (Singapore)",
      title: "Full-Stack Developer Intern",
      logoUrl: "",
      start: "February 2023",
      end: "May 2023",
      description:
        "Developed MERN stack applications, collaborated with design teams, and handled production deployments.",
    },
  ],

  education: [
    {
      school: "Guru Gobind Singh Indraprastha University",
      href: "",
      degree: "B.Tech in Computer Science & Engineering",
      logoUrl: "",
      start: "2022",
      end: "2026",
    },
    {
      school: "Rajkiya Pratibha Vikas Vidyalaya, Dwarka",
      href: "",
      degree: "Class XII – PCM + Computer Science",
      logoUrl: "",
      start: "2017",
      end: "2022",
    },
  ],

  projects: [
    {
      title: "AI Website Automation Tool",
      href: "",
      dates: "2024",
      active: true,
      description:
        "Built an AI-powered automation platform that generates and deploys websites using modern full-stack technologies.",
      technologies: ["Next.js", "Node.js", "MongoDB", "Docker", "AI APIs"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Video Conferencing Platform",
      href: "",
      dates: "2023",
      active: true,
      description:
        "Developed a real-time video conferencing system using WebRTC with chat and audio-video sync.",
      technologies: ["WebRTC", "Node.js", "JavaScript"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "OpenCV Air Painter",
      href: "",
      dates: "2023",
      active: true,
      description:
        "Gesture-based virtual drawing application using OpenCV and Python, optimized for low-end hardware.",
      technologies: ["Python", "OpenCV"],
      links: [],
      image: "",
      video: "",
    },
  ],

  hackathons: [],
} as const;

