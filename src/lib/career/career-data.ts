export interface InternalProject {
  name: string;
  dateRange: string;
  stack: string[];
  description: string;
  isActive: boolean;
}

export interface CareerPosition {
  company: string;
  role: string;
  dateRange: string;
  location?: string;
  isActive: boolean;
  stack?: string[];
  description: string;
  projects?: InternalProject[];
  isPrimary: boolean;
}

export const careerData: CareerPosition[] = [
  {
    company: "Lean Mind",
    role: "Software Developer",
    dateRange: "Mar 2023 - Actualidad",
    location: "Canarias, Remoto",
    isActive: true,
    description: "Consultoría especializada en desarrollo de software, aportando valor mediante prácticas de Extreme Programming (XP), TDD y arquitecturas evolutivas en equipos de alto rendimiento.",
    isPrimary: true,
    projects: [
      {
        name: "Fintech B2B & Payments",
        dateRange: "Feb 2025 - Actualidad",
        stack: [".NET Core", "Angular", "DDD", "Hexagonal Arch"],
        description: "Desarrollo de ecosistemas de pagos B2B y facturación electrónica para el sector travel. Implementación de métodos de pago virtual (VCC) y arquitecturas resilientes para alta transaccionalidad.",
        isActive: true,
      },
      {
        name: "Global OTT Platform",
        dateRange: "Nov 2023 - Feb 2025",
        stack: ["Java Spring Boot", "Event-Driven", "Microservices", "PostgreSQL"],
        description: "Modernización de una plataforma de streaming y TV global. Orquestación de servicios para la ingesta, procesamiento y distribución de contenido multimedia a gran escala.",
        isActive: false,
      },
      {
        name: "EdTech Platform",
        dateRange: "Mar 2023 - Nov 2023",
        stack: ["React", "Java Spring Boot", "TDD", "Docker"],
        description: "Construcción de una plataforma educativa centrada en la calidad del código, aplicando TDD estricto y pipelines de entrega continua (CI/CD).",
        isActive: false,
      },
    ],
  },
  {
    company: "Codemotion",
    role: "Technical Writer & Speaker",
    dateRange: "Oct 2024 - Actualidad",
    isActive: true,
    description: "Divulgación técnica sobre Clean Code, Testing y Arquitectura de Software a través de artículos especializados y ponencias en la comunidad.",
    isPrimary: false,
  },
  {
    company: "NEWE",
    role: "Frontend Lead",
    dateRange: "Nov 2021 - Abr 2022",
    location: "Valencia, Remoto",
    isActive: false,
    stack: ["React", "TypeScript", "Redux", "Material UI"],
    description: "Liderazgo técnico en una startup de Economía Circular y Retail Tech. Desarrollo de una plataforma SaaS B2B para la gestión de logística inversa y modelos de pago por uso (Renting) en e-commerce.",
    isPrimary: false,
  },
];