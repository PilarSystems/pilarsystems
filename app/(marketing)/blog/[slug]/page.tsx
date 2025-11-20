import { notFound } from 'next/navigation'
import { Container, Section, Heading, Copy } from '@/components/marketing/core'
import { DepthCard, ScrollSection } from '@/components/motion'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import { getPostBySlug, getAllSlugs } from '@/content/blog/posts'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Blog Post nicht gefunden',
    }
  }

  return {
    title: `${post.title} | PILAR Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({
    slug,
  }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const contentHtml = post.content
    .split('\n\n')
    .map((paragraph) => {
      if (paragraph.startsWith('## ')) {
        return `<h2 class="text-3xl font-bold mb-4 mt-8">${paragraph.slice(3)}</h2>`
      }
      if (paragraph.startsWith('### ')) {
        return `<h3 class="text-2xl font-bold mb-3 mt-6">${paragraph.slice(4)}</h3>`
      }
      return `<p class="mb-4 leading-relaxed">${paragraph}</p>`
    })
    .join('')

  return (
    <div className="min-h-screen">
      <Section className="pt-32 pb-16">
        <Container>
          <ScrollSection>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-brand-cyan hover:underline mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zum Blog
            </Link>

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-brand-cyan px-3 py-1 rounded-full bg-brand-cyan/10">
                  {post.category}
                </span>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime} Lesezeit
                  </div>
                </div>
              </div>

              <Heading as="h1" size="3xl" className="mb-6">
                {post.title}
              </Heading>

              <Copy size="xl" muted className="mb-8">
                {post.excerpt}
              </Copy>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-cyan to-brand-cyan-dark flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <div className="font-semibold">{post.author}</div>
                  <Copy size="sm" muted>
                    PILAR SYSTEMS Team
                  </Copy>
                </div>
              </div>
            </div>
          </ScrollSection>
        </Container>
      </Section>

      <Section>
        <Container>
          <ScrollSection>
            <DepthCard className="max-w-3xl mx-auto">
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </DepthCard>
          </ScrollSection>
        </Container>
      </Section>

      <Section background="muted">
        <Container>
          <ScrollSection>
            <DepthCard className="text-center py-16">
              <Heading size="xl" className="mb-4">
                Bereit, PILAR auszuprobieren?
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                Starte jetzt und automatisiere dein Fitnessstudio in wenigen Minuten
              </Copy>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Jetzt starten
              </Link>
            </DepthCard>
          </ScrollSection>
        </Container>
      </Section>
    </div>
  )
}
