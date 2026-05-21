# AdsVideoGenerator - Next Work

## Overview
This file captures the next implementation steps for the project based on the current repository state.

## Current status
- Backend has server structure, Clerk auth middleware, Prisma schema, and upload flow.
- Frontend has pages and UI scaffolding, but many pages still use dummy data.
- Root documentation is still the default Vite template.

## High-priority work
1. Backend controllers
   - Implement `createVideo` in `server/controllers/projectController.ts`.
   - Implement `getAllPublishedProjects` in `server/controllers/projectController.ts`.
   - Implement `deleteProject` in `server/controllers/projectController.ts`.
   - Ensure `createProject` returns the created project or project ID.
   - Fix Cloudinary upload option typo: `resource_type`.
   - Clean up uploaded temp files after Cloudinary upload.

2. Routes and API support
   - Fix `server/routes/projectRoutes.ts` delete path: remove extra space in `/:projectId `.
   - Add a project-by-id endpoint for frontend `Result` page if needed.
   - Add publish/unpublish or list endpoints for community content.

3. Frontend integration
   - Replace dummy data in `client/src/pages/Result.tsx` with actual API fetch.
   - Replace dummy data in `client/src/pages/MyGenerations.tsx` with authenticated user project fetch.
   - Implement API call in `client/src/pages/Genetator.tsx` for image upload and project creation.
   - Add loading, success, and error handling for generation actions.

4. Auth and session flow
   - Confirm Clerk auth is working on both client and server.
   - Protect generation, my generations, and result pages as needed.
   - Ensure frontend sends auth tokens/session cookies to backend.

5. Documentation
   - Replace root `README.md` with project-specific setup/run instructions.
   - Add `.env.example` showing required variables for Clerk, database, and Cloudinary.
   - Document database migration and how to run Prisma.

## Optional enhancements
- Add validation for upload file types and image count.
- Add a proper generation status polling endpoint for long-running AI/video jobs.
- Add tests for both backend endpoints and frontend page behavior.
- Add deployment notes: client hosting and server hosting.

## Commit note
- This work was reviewed and planned as of `2026-05-21`.
- After finishing these items, use:
  ```bash
  git add TODO.md
  git commit -m "Add project next-work TODO and planning notes"
  git push origin main
  ```
