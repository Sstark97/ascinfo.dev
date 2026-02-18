import { careerData } from "@/src/lib/career/career-data";
import { AUTHOR } from "@/src/lib/seo/constants";
import type { CareerPosition } from "@/src/lib/career/career-data";

export interface CvEducation {
  readonly institution: string;
  readonly degree: string;
  readonly dateRange: string;
  readonly location: string;
}

export interface CvData {
  readonly name: string;
  readonly jobTitle: string;
  readonly description: string;
  readonly socialLinks: {
    readonly linkedin: string;
    readonly github: string;
  };
  readonly education: readonly CvEducation[];
  readonly positions: readonly CareerPosition[];
  readonly technicalStack: {
    readonly backend: readonly string[];
    readonly frontend: readonly string[];
    readonly devops: readonly string[];
  };
}

export const cvData: CvData = {
  name: AUTHOR.name,
  jobTitle: AUTHOR.jobTitle,
  description: AUTHOR.description,
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/aitorscinfo/",
    github: "https://github.com/Sstark97",
  },
  education: [
    {
      institution: "IES Ana Luisa Benítez",
      degree: "CFGS Desarrollo de Aplicaciones Web",
      dateRange: "2019 - 2021",
      location: "Canarias",
    },
  ],
  positions: careerData,
  technicalStack: {
    backend: [".NET", "Java Spring Boot", "Node.js", "PostgreSQL", "Event-Driven"],
    frontend: ["React", "Angular", "TypeScript", "Next.js", "Tailwind CSS"],
    devops: ["Docker", "Git", "CI/CD", "Modulith", "Azure"],
  },
} as const;
