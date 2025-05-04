import type { StructureResolver } from 'sanity/structure'
import { CogIcon, DocumentTextIcon, CodeIcon, UserIcon, TagIcon, LinkIcon } from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Portfolio Content')
    .items([
      // Settings
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.divider(),

      // Content Types
      S.listItem()
        .title('Projects')
        .icon(CodeIcon)
        .child(
          S.documentTypeList('project')
            .title('Projects')
        ),
      
      S.listItem()
        .title('Blog')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Blog Content')
            .items([
              S.documentTypeListItem('post').title('All Posts'),
              S.documentTypeListItem('category').title('Categories'),
            ])
        ),

      S.listItem()
        .title('Social Links')
        .icon(LinkIcon)
        .child(
          S.documentTypeList('social')
            .title('Social Links')
        ),

      S.divider(),

      // Other Management
      S.listItem()
        .title('Authors')
        .icon(UserIcon)
        .child(
          S.documentTypeList('author')
            .title('Authors')
        ),

      S.divider(),
    ])
