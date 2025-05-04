import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'Title of the website shown in the browser tab',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Description for SEO',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainName',
      title: 'Main Name',
      type: 'string',
      description: 'Your full name displayed on the homepage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      description: 'Your job title displayed on the homepage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headerText',
      title: 'Header Text',
      type: 'string',
      description: 'Large text displayed in the background (e.g., "I BUILD WEBSITES")',
      initialValue: 'I BUILD WEBSITES',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }
      ],
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      description: 'Text for the primary call-to-action button',
      initialValue: 'View Work',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
      description: 'Link for the primary call-to-action button',
      initialValue: '/projects',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryCtaText',
      title: 'Secondary CTA Text',
      type: 'string',
      description: 'Text for the secondary call-to-action button',
      initialValue: 'Contact Me',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryCtaLink',
      title: 'Secondary CTA Link',
      type: 'string',
      description: 'Link for the secondary call-to-action button',
      initialValue: '/contact',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'mainName',
    },
  },
}); 