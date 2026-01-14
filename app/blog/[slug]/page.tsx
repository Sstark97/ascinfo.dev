import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { CodeBlock } from "@/components/detail/code-block"
import { Callout } from "@/components/detail/callout"
import { TableOfContents } from "@/components/detail/table-of-contents"
import { ArticleNav } from "@/components/detail/article-nav"

// Mock data
const article = {
  slug: "arquitectura-hexagonal-spring",
  title: "Arquitectura Hexagonal en Spring",
  date: "15 Diciembre 2024",
  readingTime: "12 min de lectura",
  author: "Carlos García",
  tags: ["Java", "Spring", "Arquitectura"],
}

const tocItems = [
  { id: "introduccion", title: "Introducción", level: 2 },
  { id: "que-es", title: "¿Qué es la Arquitectura Hexagonal?", level: 2 },
  { id: "puertos", title: "Puertos", level: 3 },
  { id: "adaptadores", title: "Adaptadores", level: 3 },
  { id: "implementacion", title: "Implementación en Spring", level: 2 },
  { id: "conclusiones", title: "Conclusiones", level: 2 },
]

const codeExample = `// Domain Port
public interface UserRepository {
    User findById(UserId id);
    void save(User user);
}

// Infrastructure Adapter
@Repository
public class JpaUserRepository implements UserRepository {
    private final JpaUserEntityRepository jpaRepository;

    @Override
    public User findById(UserId id) {
        return jpaRepository.findById(id.getValue())
            .map(UserMapper::toDomain)
            .orElseThrow();
    }
}`

export default function BlogDetailPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-1 text-sm">
            <Link href="/" className="text-[#888888] transition-colors hover:text-[#fca311]">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 text-[#666666]" />
            <Link href="/blog" className="text-[#888888] transition-colors hover:text-[#fca311]">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4 text-[#666666]" />
            <span className="truncate text-[#f5f5f5]">{article.title}</span>
          </nav>

          {/* Title */}
          <h1 className="text-balance text-3xl font-bold text-[#f5f5f5] md:text-4xl lg:text-5xl">{article.title}</h1>

          {/* Metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#888888]">
            <span>{article.date}</span>
            <span className="h-1 w-1 rounded-full bg-[#666666]" />
            <span>{article.readingTime}</span>
            <span className="h-1 w-1 rounded-full bg-[#666666]" />
            <span>{article.author}</span>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#2a2a2a] px-3 py-1 font-mono text-xs text-[#888888]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="flex gap-12">
          {/* Main content */}
          <article className="min-w-0 max-w-3xl flex-1">
            <div className="prose-content">
              <section id="introduccion">
                <h2 className="mb-4 text-2xl font-bold text-[#f5f5f5]">Introducción</h2>
                <p className="mb-4 leading-relaxed text-[#e5e5e5]">
                  La arquitectura hexagonal, también conocida como arquitectura de puertos y adaptadores, es un patrón
                  de diseño que permite aislar la lógica de negocio de los detalles de infraestructura. Este enfoque
                  facilita el testing, la mantenibilidad y la evolución del sistema a lo largo del tiempo.
                </p>
              </section>

              <section id="que-es" className="mt-10">
                <h2 className="mb-4 text-2xl font-bold text-[#f5f5f5]">¿Qué es la Arquitectura Hexagonal?</h2>
                <p className="mb-4 leading-relaxed text-[#e5e5e5]">
                  Propuesta por Alistair Cockburn en 2005, esta arquitectura organiza el código en tres capas
                  principales: el dominio en el centro, los puertos como contratos, y los adaptadores como
                  implementaciones concretas.
                </p>

                <Callout type="info" title="Nota importante">
                  La arquitectura hexagonal no es exclusiva de Java o Spring. Puede aplicarse en cualquier lenguaje o
                  framework que soporte inversión de dependencias.
                </Callout>

                <h3 id="puertos" className="mb-3 mt-8 text-xl font-semibold text-[#f5f5f5]">
                  Puertos
                </h3>
                <p className="mb-4 leading-relaxed text-[#e5e5e5]">
                  Los puertos son interfaces que definen cómo el dominio se comunica con el mundo exterior. Existen dos
                  tipos: puertos primarios (driving) que exponen casos de uso, y puertos secundarios (driven) que
                  definen dependencias externas.
                </p>

                <h3 id="adaptadores" className="mb-3 mt-8 text-xl font-semibold text-[#f5f5f5]">
                  Adaptadores
                </h3>
                <p className="mb-4 leading-relaxed text-[#e5e5e5]">
                  Los adaptadores son las implementaciones concretas de los puertos. Pueden ser controladores REST,
                  repositorios JPA, clientes HTTP, o cualquier otro componente que conecte el dominio con la
                  infraestructura.
                </p>
              </section>

              <section id="implementacion" className="mt-10">
                <h2 className="mb-4 text-2xl font-bold text-[#f5f5f5]">Implementación en Spring</h2>
                <p className="mb-4 leading-relaxed text-[#e5e5e5]">
                  Veamos un ejemplo práctico de cómo implementar un puerto secundario y su adaptador en Spring Boot:
                </p>

                <CodeBlock code={codeExample} language="java" filename="UserRepository.java" />

                <Callout type="warning" title="Cuidado">
                  Evita exponer entidades JPA directamente desde el dominio. Siempre usa mappers para convertir entre
                  entidades de infraestructura y objetos del dominio.
                </Callout>
              </section>

              <section id="conclusiones" className="mt-10">
                <h2 className="mb-4 text-2xl font-bold text-[#f5f5f5]">Conclusiones</h2>
                <p className="mb-4 leading-relaxed text-[#e5e5e5]">
                  La arquitectura hexagonal es una excelente opción para aplicaciones que necesitan ser testables,
                  mantenibles y flexibles ante cambios de infraestructura. En Spring Boot, su implementación es natural
                  gracias al soporte nativo de inyección de dependencias.
                </p>
              </section>
            </div>

            {/* Navigation */}
            <ArticleNav
              basePath="/blog"
              prev={{ slug: "testing-junit-5", title: "Testing con JUnit 5: Guía Completa" }}
              next={{ slug: "clean-code-principios", title: "Principios de Clean Code" }}
            />
          </article>

          {/* Sidebar - Desktop only */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <TableOfContents items={tocItems} />
          </aside>
        </div>
      </div>
    </div>
  )
}
