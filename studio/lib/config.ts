import { apiVersion, dataset, projectId } from './env';

export const config = {
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
}; 