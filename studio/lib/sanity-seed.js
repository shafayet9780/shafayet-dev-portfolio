/**
 * This script initializes the default site settings in Sanity
 * Run with: npx sanity exec ./studio/lib/sanity-seed.js --with-user-token
 */

import { createClient } from '@sanity/client'
import { config } from './config'

const client = createClient({
  ...config,
  useCdn: false,
})

const siteSettings = {
  _type: 'siteSettings',
  title: 'Shafayet Ahmmed | Full Stack Developer',
  description: 'Portfolio of Shafayet Ahmmed, a passionate Full Stack Developer',
  mainName: 'Shafayet Ahmmed',
  jobTitle: 'Full Stack Web Developer',
  headerText: 'I BUILD WEBSITES',
  ctaText: 'View Work',
  ctaLink: '/projects',
  secondaryCtaText: 'Contact Me',
  secondaryCtaLink: '/contact',
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

    console.log('Seed process completed!')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

seedData() 