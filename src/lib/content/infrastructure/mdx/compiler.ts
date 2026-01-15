import { compileMDX } from "next-mdx-remote/rsc"
import { mdxComponents } from "./components"
import type { ReactElement } from "react"

type CompileResult<T> = {
  frontmatter: T
  content: ReactElement
}

export async function compileMDXContent<T>(source: string): Promise<CompileResult<T>> {
  const { frontmatter, content } = await compileMDX<T>({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
    },
  })

  return { frontmatter, content }
}
