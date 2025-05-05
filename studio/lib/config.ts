import { apiVersion, dataset, projectId } from '../../lib/env';

export const config = {
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
}; 