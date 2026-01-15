import { CodeBlock } from "@/components/detail/code-block"
import { Callout } from "@/components/detail/callout"
import type { ReactNode, ReactElement, HTMLAttributes } from "react"

function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") {
    return children
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("")
  }
  if (children && typeof children === "object" && "props" in children) {
    const element = children as ReactElement<{ children?: ReactNode }>
    return extractTextFromChildren(element.props.children)
  }
  return ""
}

type PreProps = {
  children?: ReactNode
}

type HeadingProps = HTMLAttributes<HTMLHeadingElement>
type ParagraphProps = HTMLAttributes<HTMLParagraphElement>
type ListProps = HTMLAttributes<HTMLUListElement | HTMLOListElement>
type ListItemProps = HTMLAttributes<HTMLLIElement>
type AnchorProps = HTMLAttributes<HTMLAnchorElement> & { href?: string }
type StrongProps = HTMLAttributes<HTMLElement>
type EmProps = HTMLAttributes<HTMLElement>
type BlockquoteProps = HTMLAttributes<HTMLQuoteElement>
type CodeProps = HTMLAttributes<HTMLElement>

export const mdxComponents = {
  CodeBlock,
  Callout,
  h1: ({ children, ...props }: HeadingProps): ReactElement => (
    <h1 className="mb-6 mt-8 text-4xl font-bold text-[#f5f5f5] first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: HeadingProps): ReactElement => (
    <h2 className="mb-4 mt-8 text-3xl font-semibold text-[#f5f5f5] first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: HeadingProps): ReactElement => (
    <h3 className="mb-3 mt-6 text-2xl font-semibold text-[#f5f5f5] first:mt-0" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: HeadingProps): ReactElement => (
    <h4 className="mb-2 mt-5 text-xl font-semibold text-[#f5f5f5] first:mt-0" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: HeadingProps): ReactElement => (
    <h5 className="mb-2 mt-4 text-lg font-semibold text-[#f5f5f5] first:mt-0" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: HeadingProps): ReactElement => (
    <h6 className="mb-2 mt-4 text-base font-semibold text-[#f5f5f5] first:mt-0" {...props}>
      {children}
    </h6>
  ),
  p: ({ children, ...props }: ParagraphProps): ReactElement => (
    <p className="mb-4 leading-relaxed text-[#e5e5e5]" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ListProps): ReactElement => (
    <ul className="mb-4 ml-6 list-disc space-y-2 text-[#e5e5e5] marker:text-[#fca311]" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ListProps): ReactElement => (
    <ol className="mb-4 ml-6 list-decimal space-y-2 text-[#e5e5e5] marker:text-[#fca311]" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ListItemProps): ReactElement => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }: AnchorProps): ReactElement => (
    <a
      href={href}
      className="text-[#fca311] no-underline transition-colors hover:underline"
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children, ...props }: StrongProps): ReactElement => (
    <strong className="font-semibold text-[#f5f5f5]" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: EmProps): ReactElement => (
    <em className="italic text-[#e5e5e5]" {...props}>
      {children}
    </em>
  ),
  blockquote: ({ children, ...props }: BlockquoteProps): ReactElement => (
    <blockquote
      className="my-6 border-l-4 border-[#fca311] pl-4 italic text-[#888888]"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }: CodeProps): ReactElement => (
    <code
      className="rounded bg-[#2a2a2a] px-1.5 py-0.5 font-mono text-sm text-[#fca311]"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children }: PreProps): ReactElement => {
    const childElement = children as ReactElement<{ className?: string; children?: ReactNode }>
    const className = childElement?.props?.className ?? ""
    const language = className.replace("language-", "") || "text"
    const code = extractTextFromChildren(childElement?.props?.children)
    return <CodeBlock code={code.trim()} language={language} />
  },
}
