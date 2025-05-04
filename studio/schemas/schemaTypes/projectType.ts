import { defineArrayMember, defineField, defineType } from 'sanity'
import { CodeIcon } from '@sanity/icons'

export const projectType = defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  icon: CodeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short description for the project card',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories/Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
      description: 'Tags will be used for styling the project card',
    }),
    defineField({
      name: 'sourceCodeUrl',
      title: 'Source Code URL',
      type: 'url',
      description: 'Link to GitHub repository or source code',
    }),
    defineField({
      name: 'demoUrl',
      title: 'Live Demo URL',
      type: 'url',
      description: 'Link to live demo of the project',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'blockContent',
      description: 'Full project description for the project page',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      tags: 'categories.0.title',
    },
    prepare(selection) {
      const { tags } = selection;
      return { ...selection, subtitle: tags ? `Tag: ${tags}` : 'No tags yet' };
    },
  },
}); 