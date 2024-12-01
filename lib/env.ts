const isDevelopment = process.env.NODE_ENV === "development";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-10";

export const dataset = assertValue(
  isDevelopment
    ? process.env.NEXT_PUBLIC_SANITY_DATASET_DEVELOPMENT
    : process.env.NEXT_PUBLIC_SANITY_DATASET_PRODUCTION,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
