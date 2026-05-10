export interface InternalProject {
  name: string;
  dateRange: string;
  stack: string[];
  description: string;
  isActive: boolean;
  impact?: string[];
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
  impact?: string[];
}

const careerDataEs: CareerPosition[] = [
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
        impact: [
          "Diseño e implementación de la integración con proveedores de VCC (tarjetas virtuales) para pagos B2B en el sector travel",
          "Arquitectura hexagonal con .NET Core para un sistema de facturación electrónica con alta transaccionalidad",
        ],
      },
      {
        name: "Global OTT Platform",
        dateRange: "Nov 2023 - Feb 2025",
        stack: ["Java Spring Boot", "Event-Driven", "Microservices", "PostgreSQL"],
        description: "Modernización de una plataforma de streaming y TV global. Orquestación de servicios para la ingesta, procesamiento y distribución de contenido multimedia a gran escala.",
        isActive: false,
        impact: [
          "Orquestación de microservicios event-driven para la ingesta y distribución de contenido multimedia",
          "Modernización de pipeline de procesamiento de vídeo",
        ],
      },
      {
        name: "EdTech Platform",
        dateRange: "Mar 2023 - Nov 2023",
        stack: ["React", "Java Spring Boot", "TDD", "Docker"],
        description: "Construcción de una plataforma educativa centrada en la calidad del código, aplicando TDD estricto y pipelines de entrega continua (CI/CD).",
        isActive: false,
        impact: [
          "Plataforma educativa construida con TDD estricto desde el día 1",
          "Implementación de pipelines CI/CD con Docker",
        ],
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
    impact: [
      "Liderazgo técnico del frontend de una plataforma SaaS B2B de logística inversa",
      "Arquitectura frontend con React + Redux + TypeScript desde cero",
    ],
  },
];

const careerDataEn: CareerPosition[] = [
  {
    company: "Lean Mind",
    role: "Software Developer",
    dateRange: "Mar 2023 - Present",
    location: "Canary Islands, Remote",
    isActive: true,
    description: "Specialized software development consultancy, delivering value through Extreme Programming (XP), TDD, and evolutionary architectures in high-performance teams.",
    isPrimary: true,
    projects: [
      {
        name: "Fintech B2B & Payments",
        dateRange: "Feb 2025 - Present",
        stack: [".NET Core", "Angular", "DDD", "Hexagonal Arch"],
        description: "Building B2B payment ecosystems and e-invoicing for the travel sector. Implementation of virtual payment methods (VCC) and resilient architectures for high-throughput transactions.",
        isActive: true,
        impact: [
          "Designed and implemented the integration with VCC (virtual card) providers for B2B payments in the travel sector",
          "Hexagonal architecture with .NET Core for a high-throughput e-invoicing system",
        ],
      },
      {
        name: "Global OTT Platform",
        dateRange: "Nov 2023 - Feb 2025",
        stack: ["Java Spring Boot", "Event-Driven", "Microservices", "PostgreSQL"],
        description: "Modernization of a global streaming and TV platform. Service orchestration for large-scale ingestion, processing, and distribution of multimedia content.",
        isActive: false,
        impact: [
          "Orchestrated event-driven microservices for ingestion and distribution of multimedia content",
          "Modernization of the video processing pipeline",
        ],
      },
      {
        name: "EdTech Platform",
        dateRange: "Mar 2023 - Nov 2023",
        stack: ["React", "Java Spring Boot", "TDD", "Docker"],
        description: "Building an education platform focused on code quality, applying strict TDD and continuous delivery pipelines (CI/CD).",
        isActive: false,
        impact: [
          "Education platform built with strict TDD from day one",
          "CI/CD pipelines implemented with Docker",
        ],
      },
    ],
  },
  {
    company: "Codemotion",
    role: "Technical Writer & Speaker",
    dateRange: "Oct 2024 - Present",
    isActive: true,
    description: "Technical outreach on Clean Code, Testing, and Software Architecture through specialized articles and community talks.",
    isPrimary: false,
  },
  {
    company: "NEWE",
    role: "Frontend Lead",
    dateRange: "Nov 2021 - Apr 2022",
    location: "Valencia, Remote",
    isActive: false,
    stack: ["React", "TypeScript", "Redux", "Material UI"],
    description: "Technical leadership at a Circular Economy and Retail Tech startup. Development of a B2B SaaS platform for reverse logistics management and pay-per-use (Renting) models in e-commerce.",
    isPrimary: false,
    impact: [
      "Technical leadership of the frontend for a B2B SaaS reverse-logistics platform",
      "Frontend architecture with React + Redux + TypeScript from scratch",
    ],
  },
];

export function getCareerData(locale: string): CareerPosition[] {
  return locale === "en" ? careerDataEn : careerDataEs;
}

export const careerData = careerDataEs;
