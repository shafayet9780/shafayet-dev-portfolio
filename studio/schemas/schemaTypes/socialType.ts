import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export const socialType = defineType({
  name: 'social',
  title: 'Social Links',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'social',
      title: 'Platform Name',
      type: 'string',
      description: 'Name of the social platform (e.g., github, twitter, linkedin)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Display Text',
      type: 'string',
      description: 'Text to display for the link (e.g., username)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      description: 'Full URL to the profile',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Determines the order of social links (lower shows first)',
      initialValue: 10,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'social',
      subtitle: 'link',
    },
  },
}); 