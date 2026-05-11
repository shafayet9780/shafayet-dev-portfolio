import { defineArrayMember, defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'companyUrl',
      title: 'Company URL',
      type: 'url',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: ['Full-time', 'Contract', 'Consulting', 'Part-time'],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      hidden: ({ parent }) => Boolean(parent?.isCurrent),
    }),
    defineField({
      name: 'isCurrent',
      title: 'Current Role',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'sectors',
      title: 'Sectors',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Examples: FinTech, SaaS, E-commerce, Platform, Healthcare',
    }),
    defineField({
      name: 'products',
      title: 'Products / Domains',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sector',
              title: 'Sector',
              type: 'string',
            }),
            defineField({
              name: 'summary',
              title: 'Summary',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'sector',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'scopeSummary',
      title: 'Scope Summary',
      type: 'text',
      rows: 3,
      description: 'Short summary of leadership, architecture, delivery, or ownership scope',
    }),
    defineField({
      name: 'proofPoints',
      title: 'Proof Points',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: '3-5 crisp bullets showing senior judgment',
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Qualitative or real metric-backed outcomes',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'companyLogo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'orderRank',
      title: 'Manual Order',
      type: 'number',
      description: 'Lower numbers appear first when dates are equal',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      companyName: 'companyName',
      role: 'role',
      startDate: 'startDate',
      endDate: 'endDate',
      isCurrent: 'isCurrent',
      media: 'companyLogo',
    },
    prepare(selection) {
      const { companyName, role, startDate, endDate, isCurrent } = selection
      const dateRange = startDate
        ? `${startDate.slice(0, 4)} - ${isCurrent ? 'Present' : endDate?.slice(0, 4) || 'Now'}`
        : ''

      return {
        title: companyName,
        subtitle: [role, dateRange].filter(Boolean).join(' / '),
        media: selection.media,
      }
    },
  },
})
