'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Container, 
  Section, 
  Heading, 
  Copy, 
  GlassCard, 
  MotionInView 
} from '@/components/marketing/core'
import { 
  Calendar, 
  Clock, 
  ArrowRight,
  BookOpen,
  TrendingUp,
  Users,
  Zap,
  MessageSquare,
  Target
} from 'lucide-react'
import { motion } from 'framer-motion'

const blogPosts = [
  {
    slug: 'ai-revolution-fitness',
    title: 'Die AI-Revolution im Fitness-Business',
    excerpt: 'Wie künstliche Intelligenz die Fitnessstudio-Branche transformiert und warum Studios, die jetzt nicht automatisieren, den Anschluss verlieren.',
    category: 'Trends',
    date: '15. November 2024',
    readTime: '8 Min',
    icon: Zap,
    featured: true
  },
  {
    slug: 'lead-conversion-optimieren',
    title: '5 Wege, deine Lead-Conversion um 40% zu steigern',
    excerpt: 'Praktische Tipps und bewährte Strategien, um mehr Interessenten in zahlende Mitglieder zu verwandeln – ohne mehr Budget.',
    category: 'Marketing',
    date: '8. November 2024',
    readTime: '6 Min',
    icon: TrendingUp,
    featured: true
  },
  {
    slug: 'whatsapp-business-guide',
    title: 'WhatsApp Business für Fitnessstudios: Der komplette Guide',
    excerpt: 'Alles, was du über WhatsApp Business API wissen musst: Setup, Best Practices, rechtliche Aspekte und wie du damit mehr Leads konvertierst.',
    category: 'Tutorial',
    date: '1. November 2024',
    readTime: '12 Min',
    icon: MessageSquare,
    featured: true
  },
  {
    slug: 'dsgvo-fitness-automation',
    title: 'DSGVO & Fitness-Automation: Was du wissen musst',
    excerpt: 'Datenschutz-konforme Automatisierung im Fitnessstudio. Ein praktischer Leitfaden für DSGVO-konforme AI-Nutzung.',
    category: 'Legal',
    date: '25. Oktober 2024',
    readTime: '10 Min',
    icon: Target,
    featured: false
  },
  {
    slug: 'customer-retention-strategies',
    title: 'Customer Retention: So hältst du deine Mitglieder langfristig',
    excerpt: 'Die besten Strategien, um Mitglieder-Churn zu reduzieren und die Lifetime Value deiner Kunden zu maximieren.',
    category: 'Business',
    date: '18. Oktober 2024',
    readTime: '7 Min',
    icon: Users,
    featured: false
  },
  {
    slug: 'phone-automation-roi',
    title: 'ROI von Phone Automation: Eine Fallstudie',
    excerpt: 'Wie ein Münchner Studio mit AI Phone Automation 40% mehr Leads konvertierte und dabei 20 Stunden pro Woche sparte.',
    category: 'Case Study',
    date: '11. Oktober 2024',
    readTime: '9 Min',
    icon: BookOpen,
    featured: false
  }
]

const categories = [
  'Alle',
  'Trends',
  'Marketing',
  'Tutorial',
  'Legal',
  'Business',
  'Case Study'
]

export function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section noPadding className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/10 via-background to-brand-cyan-dark/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,209,197,0.1),transparent_50%)]" />
        
        <Container className="relative z-10 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 mb-8"
            >
              <BookOpen className="h-4 w-4 text-brand-cyan" />
              <span className="text-sm font-medium text-brand-cyan">PILAR Blog</span>
            </motion.div>

            <Heading as="h1" size="3xl" className="mb-6">
              Insights & Best Practices
              <br />
              <span className="bg-gradient-to-r from-brand-cyan to-brand-cyan-dark bg-clip-text text-transparent">
                für Fitnessstudios
              </span>
            </Heading>

            <Copy size="xl" className="max-w-3xl mx-auto" muted>
              Tipps, Trends und Strategien für erfolgreiches Studio-Management im digitalen Zeitalter
            </Copy>
          </motion.div>
        </Container>
      </Section>

      {/* Categories */}
      <Section>
        <Container>
          <div className="flex flex-wrap gap-3 justify-center mb-16">
            {categories.map((category, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  category === 'Alle'
                    ? 'bg-brand-cyan text-white'
                    : 'bg-muted text-muted-foreground hover:bg-brand-cyan/10 hover:text-brand-cyan'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Featured Posts */}
          <div className="mb-16">
            <Heading size="lg" className="mb-8">
              Featured Posts
            </Heading>
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts.filter(post => post.featured).map((post, i) => {
                const Icon = post.icon
                return (
                  <MotionInView key={i} delay={i * 0.1}>
                    <Link href={`/blog/${post.slug}`}>
                      <GlassCard className="h-full hover:border-brand-cyan/50 transition-all cursor-pointer group">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-cyan/10 mb-4 group-hover:bg-brand-cyan/20 transition-colors">
                          <Icon className="w-6 h-6 text-brand-cyan" />
                        </div>

                        {/* Category & Date */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-medium text-brand-cyan px-2 py-1 rounded-full bg-brand-cyan/10">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-brand-cyan transition-colors">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <Copy size="sm" muted className="mb-4">
                          {post.excerpt}
                        </Copy>

                        {/* Read Time */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {post.readTime} Lesezeit
                        </div>
                      </GlassCard>
                    </Link>
                  </MotionInView>
                )
              })}
            </div>
          </div>

          {/* All Posts */}
          <div>
            <Heading size="lg" className="mb-8">
              Alle Artikel
            </Heading>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.map((post, i) => {
                const Icon = post.icon
                return (
                  <MotionInView key={i} delay={i * 0.05}>
                    <Link href={`/blog/${post.slug}`}>
                      <GlassCard className="hover:border-brand-cyan/50 transition-all cursor-pointer group">
                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-cyan/10 flex-shrink-0 group-hover:bg-brand-cyan/20 transition-colors">
                            <Icon className="w-6 h-6 text-brand-cyan" />
                          </div>

                          <div className="flex-1">
                            {/* Category & Date */}
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-medium text-brand-cyan px-2 py-1 rounded-full bg-brand-cyan/10">
                                {post.category}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {post.date}
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-cyan transition-colors">
                              {post.title}
                            </h3>

                            {/* Excerpt */}
                            <Copy size="sm" muted className="mb-3 line-clamp-2">
                              {post.excerpt}
                            </Copy>

                            {/* Read Time */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {post.readTime} Lesezeit
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </MotionInView>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* Newsletter CTA */}
      <Section background="gradient">
        <Container>
          <MotionInView>
            <GlassCard className="text-center py-16 border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 to-brand-cyan-dark/10">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-cyan/10 mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-brand-cyan" />
              </div>
              <Heading size="xl" className="mb-4">
                Bleib auf dem Laufenden
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                Erhalte die neuesten Artikel, Tipps und Insights direkt in dein Postfach
              </Copy>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="deine@email.de"
                  className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-brand-cyan"
                />
                <Button className="bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:opacity-90">
                  Abonnieren
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <Copy size="sm" muted className="mt-4">
                Kein Spam. Jederzeit abmelden.
              </Copy>
            </GlassCard>
          </MotionInView>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section>
        <Container>
          <MotionInView>
            <GlassCard className="text-center py-16 border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 to-brand-cyan-dark/10">
              <Heading size="xl" className="mb-4">
                Bereit, PILAR auszuprobieren?
              </Heading>
              <Copy size="lg" muted className="max-w-2xl mx-auto mb-8">
                Starte jetzt und automatisiere dein Fitnessstudio in wenigen Minuten
              </Copy>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:opacity-90">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline">
                    Preise ansehen
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </MotionInView>
        </Container>
      </Section>
    </div>
  )
}
