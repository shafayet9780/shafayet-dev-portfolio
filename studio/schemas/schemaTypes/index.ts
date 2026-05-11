import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { projectType } from './projectType'
import { socialType } from './socialType'
import { siteSettingsType } from './siteSettingsType'
import { experienceType } from './experienceType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    projectType,
    experienceType,
    socialType,
    siteSettingsType,
  ],
}
