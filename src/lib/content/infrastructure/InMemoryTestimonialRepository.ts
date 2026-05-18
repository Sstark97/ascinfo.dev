import { Testimonial } from "@/content/domain/entities/Testimonial"
import type { TestimonialRepository } from "@/content/domain/repositories/TestimonialRepository"
import type { Locale } from "@/content/domain/types/Locale"

export type RawTestimonial = {
  slug: string
  author: string
  role: string
  company: string
  linkedinUrl: string
  avatarUrl: string
  quoteEs: string
  quoteEn: string
}

const REAL_TESTIMONIALS: ReadonlyArray<RawTestimonial> = [
  {
    slug: "jose-cabello-cubero",
    author: "José Cabello Cubero",
    role: "Software Engineer | Game Developer | XP",
    company: "",
    linkedinUrl: "https://www.linkedin.com/in/jose-cabello-cubero-231262185/",
    avatarUrl: "/testimonials/jose-cabello-cubero.jpg",
    quoteEs:
      "Aitor, desde el primer día, empezó a aportar valor al equipo incluso sin conocer en profundidad el producto. Llegó con un conjunto sólido de buenas prácticas que elevó nuestro nivel, impulsando el código limpio, mantenible y fomentando esa cultura dentro del equipo. En lo personal, Aitor destaca por su calidad humana ya que recibe muy bien las críticas constructivas, siempre está dispuesto a aprender, ayudar y ofrecer feedback. Trabajar con él ha sido realmente enriquecedor.",
    quoteEn:
      "From day one, Aitor started adding value to the team even without knowing the product in depth. He brought a solid set of best practices that raised our level, promoting clean, maintainable code and fostering that culture within the team. On a personal note, Aitor stands out for his human qualities — he welcomes constructive criticism, is always willing to learn, help and give feedback. Working with him has been truly enriching.",
  },
  {
    slug: "raul-padilla",
    author: "Raúl Padilla",
    role: "Software Developer",
    company: "",
    linkedinUrl: "https://www.linkedin.com/in/raulpadilladelgado/",
    avatarUrl: "/testimonials/raul-padilla.jpg",
    quoteEs:
      "Tuve el placer de trabajar recientemente con Aitor en un proyecto. Desde el primer día, destacó por su increíble capacidad para trabajar en equipo, su escucha activa y su compromiso con la mejora continua. Aitor no solo aplicó de manera ejemplar las prácticas de Xtreme Programming, sino que también se aseguró de que todos en el equipo crecieran con él. Siempre estuvo enfocado en aportar valor al colaborador, promoviendo buenas prácticas de desarrollo y elevando la calidad del código a través de refactors y pruebas automatizadas. Además, su impacto fue más allá del código. Impartió charlas internas sobre tecnologías y desarrollo sostenible. Nunca se conforma, siempre se cuestiona el status quo y busca la excelencia en cada línea de código y en cada interacción. Es un gran profesional y compañero, sería un gran activo para cualquier equipo.",
    quoteEn:
      "I had the pleasure of recently working with Aitor on a project. From day one, he stood out for his incredible ability to work as a team, his active listening, and his commitment to continuous improvement. Aitor not only applied Extreme Programming practices in an exemplary way, but also made sure everyone on the team grew alongside him. He was always focused on bringing value to his collaborators, promoting development best practices and raising code quality through refactors and automated tests. His impact went beyond code: he gave internal talks on technologies and sustainable development. He never settles, always questions the status quo, and seeks excellence in every line of code and every interaction. He is a great professional and teammate, and would be a great asset to any team.",
  },
  {
    slug: "ardiel-fuentes-sanchez",
    author: "Ardiel Fuentes Sánchez",
    role: "Backend Chapter Lead",
    company: "Agile Content",
    linkedinUrl: "https://www.linkedin.com/in/ardiel/",
    avatarUrl: "/testimonials/ardiel-fuentes-sanchez.jpg",
    quoteEs:
      "Aitor es un buen compañero de trabajo, acepta de forma constructiva las críticas y aporta ideas de valor en el día a día, tiene una actitud calmada y distendida y cuenta con una dosis de humor que siempre viene bien. Un placer haber compartido trabajo con él.",
    quoteEn:
      "Aitor is a great teammate. He takes criticism constructively and contributes valuable ideas day to day. He has a calm and relaxed attitude and a dose of humor that always comes in handy. A pleasure to have shared work with him.",
  },
  {
    slug: "aitor-reviriego-amor",
    author: "Aitor Reviriego Amor",
    role: "Software Developer | Refactoring, TDD & Code Quality",
    company: "",
    linkedinUrl: "https://www.linkedin.com/in/aitor-reviriego-amor/",
    avatarUrl: "/testimonials/aitor-reviriego-amor.jpg",
    quoteEs:
      "Aitor es un profesional excepcional en el desarrollo de software, con habilidades para enfrentarse a cualquier desafío con el código. Su enfoque se basa en utilizar las buenas prácticas, asegurando siempre un código limpio, mantenible y comprensible para otros desarrolladores. Además de su destreza técnica, destaca por su capacidad de análisis, resolución de problemas y su disposición para colaborar en equipo, lo que lo convierte en una pieza muy valiosa en cualquier equipo. Sin duda, trabajar con Aitor es garantía de calidad y eficiencia.",
    quoteEn:
      "Aitor is an exceptional software development professional, with the skills to tackle any coding challenge. His approach is grounded in best practices, always ensuring clean, maintainable, and understandable code for other developers. Beyond his technical skill, he stands out for his analytical mindset, problem-solving abilities, and willingness to collaborate as a team — making him a very valuable asset to any team. Working with Aitor is, without a doubt, a guarantee of quality and efficiency.",
  },
  {
    slug: "yunior-gonzalez-santana",
    author: "Yunior González Santana",
    role: "Founder",
    company: "SQUAADS",
    linkedinUrl: "https://www.linkedin.com/in/yuniorglez/",
    avatarUrl: "/testimonials/yunior-gonzalez-santana.jpg",
    quoteEs:
      "Bueno, ¿qué decir de Aitor? Simplemente si lo conocen en una entrevista personal o si coinciden con él en equipo detectarán que es un fuera de serie. Ha venido al sector de la programación a comerse el mundo. Aitor fue alumno mío en 2021 durante los meses marzo-junio y si algo me quedó claro es que aprende todo aquello que se pone por delante. Además, es capaz de no solo aprender una cosa sino de aprender otra alternativa para poder así compararlas y saber cuál viene mejor en cada caso.",
    quoteEn:
      "Well, what to say about Aitor? Simply put: meet him in a personal interview or work alongside him on a team, and you'll spot that he's exceptional. He came into the programming world ready to take it on. Aitor was my student in 2021 during March–June, and one thing became clear: he learns anything you put in front of him. He doesn't just learn one thing — he learns alternatives too, so he can compare them and pick the best one for each case.",
  },
  {
    slug: "irene-gomez-vera",
    author: "Irene Gomez Vera",
    role: "Lead Mobile Developer",
    company: "",
    linkedinUrl: "https://www.linkedin.com/in/irenegomezvera/",
    avatarUrl: "/testimonials/irene-gomez-vera.jpg",
    quoteEs:
      "He podido trabajar con Aitor en el proyecto final del Bootcamp de la EOI donde desarrollamos una aplicación que te permitía gestionar las publicaciones de diferentes redes sociales. Sobre todo destacar la gran capacidad de trabajar en equipo, el espíritu de liderazgo y el positivismo que aplicaba en todas las daily meetings. Aparte de tener una gran capacidad de programación tanto en front-end como en back-end muestra un gran interés en buscar la solución de cualquier inconveniente que pudiera surgir, siempre queriendo aportar más al proyecto.",
    quoteEn:
      "I worked with Aitor on the final project of the EOI Bootcamp, where we developed an application to manage publications across different social networks. What stands out most is his great ability to work in a team, his leadership spirit, and the positivity he brought to every daily meeting. Beyond his strong programming skills in both front-end and back-end, he shows a deep interest in finding solutions to any issue that may arise, always wanting to add more to the project.",
  },
  {
    slug: "alcibiades-cabral-diaz",
    author: "Alcibíades Cabral Díaz",
    role: "Agile | Producto | Tecnología",
    company: "",
    linkedinUrl: "https://www.linkedin.com/in/alci/",
    avatarUrl: "/testimonials/alcibiades-cabral-diaz.jpg",
    quoteEs:
      "Creatividad, pasión e instinto de superación son tres de las tantas cualidades que destacaría de Aitor. Durante el transcurso de las clases he podido observar estos aspectos constantemente a través de su implicación intentando adaptar las necesidades de los usuarios en software funcional. Asimismo, tiene la capacidad de adaptarse a entornos cambiantes y la curiosidad necesaria para profundizar en conocimientos alejados de su zona de confort sin miedo a equivocarse y con suficiente resiliencia para cambiar de ruta si así se requiere. Por último, también destacaría su capacidad para mostrar y difundir el valor del equipo desde el compañerismo incrementando el espíritu de equipo.",
    quoteEn:
      "Creativity, passion, and a drive to improve are three of the many qualities I'd highlight in Aitor. Throughout the classes I was able to observe these aspects constantly in his commitment to translating user needs into functional software. He also has the ability to adapt to changing environments and the curiosity to go deep into knowledge outside his comfort zone — without fear of making mistakes and with enough resilience to change course when needed. Lastly, I'd highlight his ability to show and spread the team's value through camaraderie, lifting team spirit.",
  },
  {
    slug: "santiago-brito-garcia",
    author: "Santiago Brito García",
    role: "Técnico Especialista en Sistemas y Tecnologías de la Información",
    company: "",
    linkedinUrl: "https://www.linkedin.com/in/santiagobritogarcia/",
    avatarUrl: "/testimonials/santiago-brito-garcia.jpg",
    quoteEs:
      "Después de trabajar junto a Aitor en un proyecto destaco de él su profesionalidad, iniciativa, proactividad y compromiso. Además, tiene la capacidad de gestionar un equipo de trabajo y generar buen ambiente.",
    quoteEn:
      "After working with Aitor on a project, I'd highlight his professionalism, initiative, proactivity, and commitment. He also has the ability to lead a team and create a great atmosphere.",
  },
  {
    slug: "jose-pena-seco",
    author: "Jose Peña Seco",
    role: "Computer Scientist & AI Engineer",
    company: "",
    linkedinUrl: "https://www.linkedin.com/in/josepe%C3%B1aseco/",
    avatarUrl: "/testimonials/jose-pena-seco.jpg",
    quoteEs:
      "Somos compañeros de la universidad, hemos hecho proyectos juntos y sin duda es una persona dispuesta, resolutiva, con una amplia capacidad de sobrepasar sus límites y con la ilusión de nunca parar de aprender.",
    quoteEn:
      "We're university classmates and have worked on projects together. Without a doubt, he's a willing and resourceful person, with a great ability to push past his limits and the drive to never stop learning.",
  },
  {
    slug: "raul-rodriguez-hernandez",
    author: "Raul S. Rodríguez Hernández",
    role: "Frontend Software Engineer",
    company: "Openbank",
    linkedinUrl: "https://www.linkedin.com/in/raul-rod/",
    avatarUrl: "/testimonials/raul-rodriguez-hernandez.jpg",
    quoteEs:
      "Un profesional en toda regla. Se implica totalmente en sus proyectos. Aprendes trabajando a su lado. Está siempre actualizándose y en busca de la innovación.",
    quoteEn:
      "A true professional. He fully commits to his projects. You learn by working alongside him. He's always staying up to date and pursuing innovation.",
  },
  {
    slug: "juan-melo-perez",
    author: "Juan Melo Pérez",
    role: "Software Engineer",
    company: "",
    linkedinUrl: "https://www.linkedin.com/in/jmelop/es/",
    avatarUrl: "/testimonials/juan-melo-perez.jpg",
    quoteEs:
      "Trabajamos desarrollando juntos un proyecto freelance, es muy eficiente y se apoya en el equipo. Es muy comunicativo y conoce bien las tecnologías.",
    quoteEn:
      "We worked together on a freelance project. He's very efficient and leans on the team. He communicates well and knows the technologies thoroughly.",
  },
]

export class InMemoryTestimonialRepository implements TestimonialRepository {
  constructor(private readonly data: ReadonlyArray<RawTestimonial> = REAL_TESTIMONIALS) {}

  async readAll(locale: Locale): Promise<Testimonial[]> {
    return this.data.map((raw) =>
      Testimonial.create(raw.slug, {
        author: raw.author,
        role: raw.role,
        company: raw.company,
        linkedinUrl: raw.linkedinUrl,
        avatarUrl: raw.avatarUrl,
        locale,
        quote: locale === "en" ? raw.quoteEn : raw.quoteEs,
      })
    )
  }
}
