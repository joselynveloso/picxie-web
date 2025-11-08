# Picxie Web - Development Priorities

## Current Status (v0.1.0)
- ✅ Basic UI/UX implemented (Dashboard, Photos, Sites, Projects, Admin)
- ✅ Supabase integration working
- ✅ Monochrome design system
- ✅ Responsive layout
- ⚠️ Data integrity issues (sites/projects showing 0)
- ❌ No authentication
- ❌ No CRUD operations
- ❌ No photo upload

---

## Phase 1: Critical Fixes & Data Integrity (IMMEDIATE)
**Goal**: Fix existing functionality and ensure data consistency

### Priority 1.1: Fix Data Discrepancies (URGENT)
**Estimated Time**: 1-2 hours

- [ ] Create debug page (`/debug`) to inspect database state
- [ ] Query and log all photos, sites, projects with full details
- [ ] Identify missing site/project records
- [ ] Create SQL migration to fix orphaned data
- [ ] Verify foreign key relationships are correct
- [ ] Test dashboard stats after fixes

**Files to Create/Modify**:
- `app/debug/page.tsx` - Debug data inspection page
- `scripts/fix-data-integrity.sql` - SQL migration script

### Priority 1.2: Environment Variables Migration
**Estimated Time**: 30 minutes

- [ ] Update `lib/supabase.ts` to use environment variables
- [ ] Create `.env.local` from `.env.example`
- [ ] Test app works with env vars
- [ ] Update deployment documentation

**Files to Modify**:
- `lib/supabase.ts` - Use `process.env.NEXT_PUBLIC_SUPABASE_URL`

### Priority 1.3: Error Handling
**Estimated Time**: 2-3 hours

- [ ] Add try-catch blocks to all Supabase queries
- [ ] Create `ErrorBoundary` component
- [ ] Display user-friendly error messages
- [ ] Log errors to console for debugging
- [ ] Add error states to loading components

**Files to Create/Modify**:
- `components/ErrorBoundary.tsx`
- `components/ErrorMessage.tsx`
- Update all page components with error handling

---

## Phase 2: Authentication & Authorization (HIGH PRIORITY)
**Goal**: Secure the application and add user management

### Priority 2.1: Supabase Auth Integration
**Estimated Time**: 4-6 hours

- [ ] Set up Supabase Auth providers (email/password, Google)
- [ ] Create login page (`/login`)
- [ ] Create signup page (`/signup`)
- [ ] Add logout functionality
- [ ] Implement auth state management
- [ ] Add protected route middleware
- [ ] Redirect unauthenticated users to login

**Files to Create**:
- `app/login/page.tsx`
- `app/signup/page.tsx`
- `lib/auth.ts` - Auth helpers
- `middleware.ts` - Route protection

### Priority 2.2: Row Level Security (RLS)
**Estimated Time**: 2-3 hours

- [ ] Enable RLS on all tables in Supabase
- [ ] Create policies for authenticated users
- [ ] Test read/write access with different user roles
- [ ] Implement admin-only access for certain features

**Supabase Configuration**:
- RLS policies for sites, projects, photos, user_profiles

### Priority 2.3: User Profile Management
**Estimated Time**: 3-4 hours

- [ ] Create profile page (`/profile`)
- [ ] Allow users to update display name, email
- [ ] Show user's uploaded photos
- [ ] Implement role-based UI (admin vs regular user)

**Files to Create**:
- `app/profile/page.tsx`
- `components/ProfileForm.tsx`

---

## Phase 3: CRUD Operations (HIGH PRIORITY)
**Goal**: Enable create, update, delete functionality

### Priority 3.1: Site Management
**Estimated Time**: 6-8 hours

- [ ] Create "Add Site" modal/page
- [ ] Form fields: name, coordinates, radius, folder name
- [ ] Implement site creation API
- [ ] Add "Edit Site" functionality
- [ ] Add "Delete Site" with confirmation
- [ ] Validate form inputs
- [ ] Update maps when site is modified

**Files to Create/Modify**:
- `components/SiteForm.tsx`
- `components/DeleteConfirmModal.tsx`
- `app/sites/new/page.tsx` or modal in sites page
- Update `app/sites/page.tsx` with Add/Edit/Delete buttons

### Priority 3.2: Project Management
**Estimated Time**: 6-8 hours

- [ ] Create "Add Project" modal/page
- [ ] Form fields: name, site (dropdown), status
- [ ] Implement project creation API
- [ ] Add "Edit Project" functionality
- [ ] Add "Delete Project" with confirmation
- [ ] Add "Toggle Status" (Active ↔ Completed)
- [ ] Update completed_at timestamp automatically

**Files to Create/Modify**:
- `components/ProjectForm.tsx`
- `app/projects/new/page.tsx` or modal
- Update `app/projects/page.tsx` with CRUD buttons

### Priority 3.3: Photo Management
**Estimated Time**: 4-5 hours

- [ ] Add "Delete Photo" functionality
- [ ] Add "Edit Photo Metadata" (site, project, address)
- [ ] Implement photo reassignment (change site/project)
- [ ] Add bulk operations (select multiple, delete, move)

**Files to Create/Modify**:
- Update `PhotoModal.tsx` with edit/delete buttons
- `components/PhotoEditForm.tsx`

---

## Phase 4: Photo Upload (MEDIUM PRIORITY)
**Goal**: Allow users to upload photos from web interface

### Priority 4.1: Upload Interface
**Estimated Time**: 8-10 hours

- [ ] Create upload page (`/upload`)
- [ ] Drag-and-drop file upload
- [ ] Select site and project from dropdowns
- [ ] Extract EXIF data (GPS, timestamp) from images
- [ ] Reverse geocode GPS to address (Google Maps API or similar)
- [ ] Preview images before upload
- [ ] Progress indicator during upload
- [ ] Upload to Supabase Storage
- [ ] Create photo record in database

**Files to Create**:
- `app/upload/page.tsx`
- `components/FileUploader.tsx`
- `lib/exif.ts` - EXIF data extraction
- `lib/geocoding.ts` - Reverse geocoding

**Dependencies to Add**:
- `exifr` - EXIF data extraction
- Consider using Google Maps Geocoding API or OpenStreetMap Nominatim

### Priority 4.2: Bulk Upload
**Estimated Time**: 4-5 hours

- [ ] Support uploading multiple photos at once
- [ ] Show upload queue with progress for each
- [ ] Handle upload errors gracefully
- [ ] Auto-assign to site based on GPS (if within radius)

---

## Phase 5: Enhanced Features (MEDIUM PRIORITY)
**Goal**: Improve user experience and add advanced features

### Priority 5.1: Search & Filtering
**Estimated Time**: 5-6 hours

- [ ] Add global search bar in header
- [ ] Search by address, site name, project name
- [ ] Add date range filter for photos
- [ ] Add status filter for projects
- [ ] Implement pagination for large datasets
- [ ] Add sort options (date, name, etc.)

**Files to Create/Modify**:
- `components/SearchBar.tsx`
- `components/DateRangePicker.tsx`
- Update all list pages with search/filter/sort

### Priority 5.2: Data Export
**Estimated Time**: 3-4 hours

- [ ] Export photos metadata to CSV
- [ ] Export sites list to CSV
- [ ] Export projects report to PDF
- [ ] Download photos as ZIP archive

**Files to Create**:
- `lib/export.ts` - Export utilities
- Add export buttons to admin panel

### Priority 5.3: Real-time Updates
**Estimated Time**: 4-5 hours

- [ ] Implement Supabase Realtime subscriptions
- [ ] Auto-refresh when new photos are uploaded (from mobile)
- [ ] Show notifications for new data
- [ ] Optimistic UI updates for mutations

**Files to Modify**:
- Update all pages to subscribe to table changes

---

## Phase 6: Admin Dashboard Enhancements (LOW PRIORITY)
**Goal**: Better admin tools and analytics

### Priority 6.1: Advanced Analytics
**Estimated Time**: 6-8 hours

- [ ] Photo upload trends (daily, weekly, monthly)
- [ ] Charts/graphs (Chart.js or Recharts)
- [ ] Site activity metrics
- [ ] User activity logs
- [ ] Storage usage statistics

**Files to Create**:
- `components/Chart.tsx`
- Update `app/admin/page.tsx` with charts

**Dependencies to Add**:
- `recharts` or `chart.js`

### Priority 6.2: User Management (Admin)
**Estimated Time**: 5-6 hours

- [ ] List all users in admin panel
- [ ] Promote/demote admin privileges
- [ ] Deactivate/activate users
- [ ] View user activity
- [ ] Reset user passwords (email link)

**Files to Create**:
- `app/admin/users/page.tsx`
- `components/UserManagementTable.tsx`

---

## Phase 7: Polish & Optimization (LOW PRIORITY)
**Goal**: Performance, UX, and accessibility improvements

### Priority 7.1: Performance Optimization
**Estimated Time**: 4-5 hours

- [ ] Implement image lazy loading
- [ ] Add loading skeletons instead of spinners
- [ ] Optimize Supabase queries (indexes, selective fields)
- [ ] Implement caching strategy
- [ ] Code splitting for large components
- [ ] Analyze bundle size and optimize

**Tools**:
- Next.js built-in image optimization
- React.lazy() for code splitting
- Lighthouse for performance audits

### Priority 7.2: Accessibility (a11y)
**Estimated Time**: 3-4 hours

- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Improve color contrast (already monochrome, should be good)
- [ ] Add alt text to all images
- [ ] Test with screen readers

**Tools**:
- axe DevTools
- WAVE browser extension

### Priority 7.3: Mobile Responsiveness
**Estimated Time**: 3-4 hours

- [ ] Test on various mobile devices
- [ ] Optimize touch targets
- [ ] Improve mobile navigation
- [ ] Test photo grid on small screens
- [ ] Optimize map display on mobile

---

## Phase 8: Testing & Quality Assurance (ONGOING)
**Goal**: Ensure reliability and prevent regressions

### Priority 8.1: Unit Testing
**Estimated Time**: 8-10 hours

- [ ] Set up Jest + React Testing Library
- [ ] Test utility functions
- [ ] Test components in isolation
- [ ] Aim for 70%+ code coverage

**Files to Create**:
- `__tests__/` directory structure
- `jest.config.js`

### Priority 8.2: Integration Testing
**Estimated Time**: 6-8 hours

- [ ] Test user flows (login, upload, view, delete)
- [ ] Test Supabase integration
- [ ] Test form submissions

### Priority 8.3: End-to-End Testing
**Estimated Time**: 8-10 hours

- [ ] Set up Playwright or Cypress
- [ ] Test critical user journeys
- [ ] Automated regression testing

---

## Phase 9: Deployment & DevOps (ONGOING)
**Goal**: Smooth deployment and monitoring

### Priority 9.1: Vercel Deployment
**Estimated Time**: 2-3 hours

- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables
- [ ] Set up production domain
- [ ] Enable automatic deployments
- [ ] Test production build

### Priority 9.2: Monitoring & Logging
**Estimated Time**: 3-4 hours

- [ ] Set up Sentry for error tracking
- [ ] Add Google Analytics or Plausible
- [ ] Monitor Supabase usage
- [ ] Set up uptime monitoring

### Priority 9.3: CI/CD Pipeline
**Estimated Time**: 4-5 hours

- [ ] GitHub Actions for automated testing
- [ ] Run linting on PRs
- [ ] Run tests before deployment
- [ ] Automated preview deployments

---

## Recommended Order of Execution

### Week 1: Critical Fixes
1. Fix data integrity issues (Priority 1.1)
2. Migrate to environment variables (Priority 1.2)
3. Add error handling (Priority 1.3)

### Week 2-3: Authentication
4. Implement Supabase Auth (Priority 2.1)
5. Set up RLS policies (Priority 2.2)
6. Create user profile page (Priority 2.3)

### Week 4-5: CRUD Operations
7. Site management (Priority 3.1)
8. Project management (Priority 3.2)
9. Photo management (Priority 3.3)

### Week 6-7: Photo Upload
10. Upload interface (Priority 4.1)
11. Bulk upload (Priority 4.2)

### Week 8: Enhanced Features
12. Search & filtering (Priority 5.1)
13. Data export (Priority 5.2)

### Week 9: Polish
14. Performance optimization (Priority 7.1)
15. Admin enhancements (Priority 6.1)

### Week 10: Testing & Deployment
16. Set up testing (Priority 8.1, 8.2)
17. Deploy to production (Priority 9.1)

---

## Success Metrics

### v0.2.0 Goals
- ✅ Data integrity fixed
- ✅ Authentication working
- ✅ Users can create/edit/delete sites and projects
- ✅ Basic error handling implemented

### v0.3.0 Goals
- ✅ Photo upload from web working
- ✅ Search and filtering functional
- ✅ Export features available

### v1.0.0 Goals (Production Ready)
- ✅ All features complete
- ✅ 70%+ test coverage
- ✅ Performance optimized
- ✅ Deployed to production
- ✅ Monitoring and logging active
- ✅ Mobile app and web app in sync

---

## Notes

- **Mobile App Coordination**: Ensure changes don't break mobile app compatibility
- **Supabase Schema Changes**: Coordinate any database schema changes carefully
- **Backward Compatibility**: Maintain compatibility with existing photo data from mobile app
- **User Feedback**: Gather feedback from actual construction teams using the app

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Leaflet](https://react-leaflet.js.org/)
- [Keep a Changelog](https://keepachangelog.com/)
