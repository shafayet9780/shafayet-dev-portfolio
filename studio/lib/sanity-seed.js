/**
 * This script initializes the default site settings in Sanity
 * Run with:
 * SANITY_API_TOKEN="your_editor_token" npx sanity exec ./studio/lib/sanity-seed.js
 *
 * SANITY_AUTH_TOKEN is also supported for compatibility with Sanity CLI naming.
 */

import { createClient } from '@sanity/client'
import { config } from './config'

const client = createClient({
  ...config,
  useCdn: false,
})

const siteSettings = {
  _type: 'siteSettings',
  title: 'Shafayet Ahmmed | Engineering Leader & Full Stack Architect',
  description: 'Portfolio of Shafayet Ahmmed, an engineering leader, full stack architect, and DevOps specialist.',
  mainName: 'Shafayet Ahmmed',
  jobTitle: 'Engineering Leader, Full Stack Architect & DevOps Specialist',
  headerText: 'HELLO WORLD',
  ctaText: 'View Case Studies',
  ctaLink: '/projects',
  secondaryCtaText: 'Start a Conversation',
  secondaryCtaLink: '/contact',
  bio: 'I help teams clarify architecture, reduce delivery risk, and ship reliable software.',
}

const portfolioCategories = [
  'Next.js',
  'Sanity',
  'Architecture',
  'DevOps',
  'Leadership',
  'Portfolio',
]

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function block(_key, text, style = 'normal') {
  return {
    _key,
    _type: 'block',
    style,
    markDefs: [],
    children: [
      {
        _key: `${_key}-span`,
        _type: 'span',
        text,
        marks: [],
      },
    ],
  }
}

const portfolioCaseStudy = {
  _id: 'project-portfolio',
  _type: 'project',
  title: 'shafayet.dev Engineering Command Center',
  slug: {
    _type: 'slug',
    current: '/portfolio',
  },
  excerpt:
    'Repositioned a VS Code-inspired portfolio into a senior engineering command center for leadership, architecture, DevOps, and case-study proof.',
  role: 'Engineering Lead, Full Stack Architect, and Frontend Engineer',
  problem:
    'The previous portfolio had a memorable VS Code metaphor, but the story leaned too much toward builder capability. It needed to communicate senior engineering leadership, architecture judgment, DevOps maturity, and delivery clarity within seconds.',
  approach:
    'Kept the VS Code shell as the brand system, then rebuilt the information architecture around senior proof: architecture brief, capability matrix, case-study framing, GitHub activity, contextual commands, and concise leadership-focused copy.',
  outcome:
    'The portfolio now reads as a focused engineering command center: easier to scan, stronger in positioning, clearer for hiring leaders, and more credible for senior technical conversations.',
  highlights: [
    'Preserved the VS Code identity while elevating the message.',
    'Reframed projects as engineering case studies.',
    'Added leadership, architecture, DevOps, and reliability signals.',
    'Built contextual command interactions without adding page clutter.',
    'Kept content editable through Sanity-backed fields.',
  ],
  process: [
    {
      _key: 'frame',
      title: 'Frame',
      description:
        'Identified the positioning gap: memorable interface, but not enough senior leadership signal.',
    },
    {
      _key: 'reposition',
      title: 'Reposition',
      description:
        'Shifted the narrative from builder showcase to engineering leadership and architecture credibility.',
    },
    {
      _key: 'structure',
      title: 'Structure',
      description:
        'Mapped homepage, projects, about, GitHub, and contact around proof surfaces.',
    },
    {
      _key: 'polish',
      title: 'Polish',
      description:
        'Reduced copy density, improved CTAs, and added contextual command interactions.',
    },
    {
      _key: 'validate',
      title: 'Validate',
      description:
        'Checked build quality, routes, responsive behavior, and interaction reliability.',
    },
  ],
  publishedAt: new Date().toISOString(),
  body: [
    block('context-title', 'Context', 'h2'),
    block(
      'context-body',
      'The original portfolio already had a strong VS Code-inspired identity. It was memorable, personal, and clearly developer-native, but the message did not yet match the senior role it needed to support.'
    ),
    block(
      'context-body-2',
      'The core challenge was positioning. The site needed to show architecture judgment, team leadership, DevOps maturity, and delivery clarity without losing the editor metaphor that made it distinctive.'
    ),
    block('shift-title', 'The Positioning Shift', 'h2'),
    block(
      'shift-body',
      'The narrative moved from builder portfolio to engineering command center. The primary audience became hiring leaders and respected engineering peers who need to understand technical judgment quickly.'
    ),
    block(
      'shift-body-2',
      'The new promise is simple: reliable systems, clearer architecture, and calmer delivery.'
    ),
    block('ia-title', 'Information Architecture', 'h2'),
    block(
      'ia-body',
      'Home now carries the first-impression signal. Projects are case studies. About reads as a leadership profile. GitHub supports credibility. Contact becomes a senior collaboration handoff.'
    ),
    block('design-title', 'Design System Direction', 'h2'),
    block(
      'design-body',
      'The VS Code shell stayed, but the surfaces became more intentional: files, tabs, command palette, right-click context, titlebar menus, architecture brief, and proof panels.'
    ),
    block(
      'design-body-2',
      'The visual rule was restraint. Fewer panels, sharper labels, and less explanation made the workspace feel more premium and less crowded.'
    ),
    block('content-title', 'Content System', 'h2'),
    block(
      'content-body',
      'Sanity owns editable project, profile, post, social, and settings content. The frontend provides durable fallbacks so incomplete content still reads clearly.'
    ),
    block(
      'content-body-2',
      'The case-study model supports context, role, approach, outcome, highlights, process, evidence links, and long-form notes.'
    ),
    block('engineering-title', 'Engineering Decisions', 'h2'),
    block(
      'engineering-body',
      'Next.js App Router provides the route structure. Sanity powers content ownership. Motion adds restrained interaction polish. GitHub API and GraphQL support credibility signals. Theme variables keep the shell consistent across workspace themes.'
    ),
    block('interaction-title', 'Interaction Details', 'h2'),
    block(
      'interaction-body',
      'The command palette supports fast navigation. The context panel exposes page-aware actions. The OS-style titlebar menus make key commands discoverable without adding another visible navigation system.'
    ),
    block(
      'interaction-body-2',
      'The goal was useful delight: interactions that reward exploration, but never hide the main story.'
    ),
    block('outcome-title', 'Outcome', 'h2'),
    block(
      'outcome-body',
      'The portfolio now communicates senior positioning faster. Case studies carry clearer proof. GitHub activity supports credibility without distracting from the homepage.'
    ),
    block(
      'outcome-body-2',
      'The result is more focused, more premium, and still personal to the developer workspace concept.'
    ),
    block('next-title', 'What I Would Improve Next', 'h2'),
    block(
      'next-body',
      'Next improvements would include sharper real project outcomes, stronger architecture visuals, SEO and AEO metadata, and more long-form technical notes.'
    ),
  ],
}

const socialLinks = [
  {
    _type: 'social',
    social: 'website',
    link: 'shafayet.dev',
    href: 'https://shafayet.dev',
    orderRank: 1,
  },
  {
    _type: 'social',
    social: 'email',
    link: 'contact@shafayet.dev',
    href: 'mailto:contact@shafayet.dev',
    orderRank: 2,
  },
  {
    _type: 'social',
    social: 'github',
    link: 'shafayet9780',
    href: 'https://github.com/shafayet9780',
    orderRank: 3,
  },
  {
    _type: 'social',
    social: 'linkedin',
    link: 'shafayet-ahmmed',
    href: 'https://www.linkedin.com/in/shafayet-ahmmed/',
    orderRank: 4,
  },
  {
    _type: 'social',
    social: 'twitter',
    link: 'shafayet_dev',
    href: 'https://twitter.com/shafayet_dev',
    orderRank: 5,
  },
]

// First check if site settings exists
async function seedData() {
  try {
    const existingSettings = await client.fetch('*[_type == "siteSettings"][0]')
    
    if (!existingSettings) {
      console.log('Creating default site settings...')
      await client.create(siteSettings)
      console.log('✅ Site settings created!')
    } else {
      console.log('Site settings document already exists')
    }

    // Check for social links
    const existingSocials = await client.fetch('*[_type == "social"]')
    
    if (!existingSocials || existingSocials.length === 0) {
      console.log('Creating default social links...')
      for (const social of socialLinks) {
        await client.create(social)
      }
      console.log('✅ Social links created!')
    } else {
      console.log(`Found ${existingSocials.length} existing social links`)
    }

    console.log('Upserting portfolio case study categories...')
    const categoryRefs = []

    for (const title of portfolioCategories) {
      const categoryId = `category-${slugify(title)}`
      await client.createIfNotExists({
        _id: categoryId,
        _type: 'category',
        title,
      })
      categoryRefs.push({
        _key: slugify(title),
        _type: 'reference',
        _ref: categoryId,
      })
    }

    const existingPortfolio = await client.fetch(
      '*[_type == "project" && slug.current in ["/portfolio", "portfolio"]][0]{_id}'
    )
    const portfolioPatch = {
      ...portfolioCaseStudy,
      categories: categoryRefs,
    }

    if (existingPortfolio?._id) {
      console.log('Updating portfolio case study...')
      const fields = { ...portfolioPatch }
      delete fields._id
      delete fields._type
      await client.patch(existingPortfolio._id).set(fields).commit()
      console.log('✅ Portfolio case study updated!')
    } else {
      console.log('Creating portfolio case study...')
      await client.create(portfolioPatch)
      console.log('✅ Portfolio case study created!')
    }

    console.log('Seed process completed!')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

seedData() 
