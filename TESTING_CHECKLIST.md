# Testing Checklist - Portfolio Website

Comprehensive testing checklist untuk memastikan semua fitur berfungsi dengan baik.

## Pre-Testing Setup

- [ ] Database migrations sudah dijalankan
- [ ] Admin user sudah dibuat
- [ ] Environment variables configured
- [ ] Application deployed atau running locally

## Frontend Testing

### Home Page (`/`)

- [ ] Page loads tanpa error
- [ ] Hero section menampilkan personal info dari database
- [ ] Stats cards menampilkan angka yang benar (projects, categories, skills)
- [ ] Featured projects grid tampil (jika ada featured items)
- [ ] Navigation links berfungsi
- [ ] Footer links accessible
- [ ] CTA email button works (jika email configured)
- [ ] Responsive di mobile

### Portfolio Page (`/portfolio`)

- [ ] Page loads dengan portfolio grid
- [ ] Category filter tampil dan berfungsi
- [ ] "All" filter menampilkan semua projects
- [ ] Filter by category works correctly
- [ ] Portfolio cards tampil dengan:
  - [ ] Image (atau placeholder jika tidak ada)
  - [ ] Title
  - [ ] Category badge
  - [ ] Featured badge (jika featured)
  - [ ] Description
  - [ ] Links (View Details, Demo, GitHub)
- [ ] Hover effects working
- [ ] "View Details" link menuju portfolio detail page
- [ ] Demo dan GitHub links membuka tab baru
- [ ] Responsive layout

### Portfolio Detail Page (`/portfolio/:id`)

- [ ] Page loads untuk valid portfolio ID
- [ ] 404 error untuk invalid ID
- [ ] Featured image tampil (atau placeholder)
- [ ] Title, category, date tampil
- [ ] Full description tampil
- [ ] Demo dan GitHub buttons working
- [ ] Sidebar info accurate
- [ ] "Kembali" link ke /portfolio
- [ ] Responsive layout

### About Page (`/about`)

- [ ] Page loads dengan personal info
- [ ] Profile image tampil (atau placeholder)
- [ ] Name dan title tampil
- [ ] Bio text readable
- [ ] Skills organized by category
- [ ] Skill level stars accurate (1-5)
- [ ] Contact section tampil
- [ ] Social links working (GitHub, LinkedIn, Twitter, Email)
- [ ] Responsive layout

## Admin Testing

### Login (`/admin/login`)

- [ ] Login page accessible tanpa auth
- [ ] Form validation works (required fields)
- [ ] Valid credentials → redirect ke dashboard
- [ ] Invalid credentials → error message tampil
- [ ] Error handling untuk network issues

### Dashboard (`/admin/dashboard`)

- [ ] Protected route (redirect ke login jika not authenticated)
- [ ] Stats cards tampil angka yang benar
- [ ] Recent projects list tampil (max 5)
- [ ] Quick action buttons link correctly:
  - [ ] Add Portfolio Item → `/admin/portfolio/new`
  - [ ] Manage Categories → `/admin/categories`
  - [ ] Edit Personal Info → `/admin/personal-info`
  - [ ] All Portfolio Items → `/admin/portfolio`
- [ ] Logout button works
- [ ] Redirects ke home setelah logout

### Portfolio Management (`/admin/portfolio`)

**List View:**
- [ ] Protected route
- [ ] All portfolio items tampil dalam table
- [ ] Thumbnails tampil correctly
- [ ] Category names tampil (bukan ID)
- [ ] Featured badge tampil untuk featured items
- [ ] Action buttons:
  - [ ] View (external link) → opens portfolio detail
  - [ ] Edit → goes to edit page
  - [ ] Delete → shows confirmation
- [ ] Delete confirmation works
- [ ] Delete removes item dari list dan database
- [ ] "Add New" button → `/admin/portfolio/new`

**Create New (`/admin/portfolio/new`):**
- [ ] Form accessible
- [ ] All fields present:
  - [ ] Title (required)
  - [ ] Short description (required)
  - [ ] Full description
  - [ ] Category (dropdown populated)
  - [ ] Demo URL
  - [ ] GitHub URL
  - [ ] Image upload
  - [ ] Featured checkbox
- [ ] Image upload:
  - [ ] Click to upload works
  - [ ] Image preview tampil
  - [ ] Remove image works
  - [ ] Accept image types (PNG, JPG, etc.)
- [ ] Form validation works (required fields)
- [ ] Save button:
  - [ ] Shows loading state
  - [ ] Uploads image to Supabase Storage
  - [ ] Saves data to database
  - [ ] Redirects ke `/admin/portfolio` setelah success
- [ ] Cancel button → back to list
- [ ] Error handling works

**Edit (`/admin/portfolio/:id`):**
- [ ] Page loads dengan existing data
- [ ] All fields pre-filled
- [ ] Current image tampil
- [ ] Can update all fields
- [ ] Image replacement:
  - [ ] Upload new image works
  - [ ] Old image deleted dari storage
  - [ ] New image uploaded
- [ ] Remove image works (sets to null)
- [ ] Update button:
  - [ ] Shows loading state
  - [ ] Updates database
  - [ ] Redirects setelah success
- [ ] Cancel button works
- [ ] Error handling

### Categories Management (`/admin/categories`)

- [ ] Protected route
- [ ] All categories tampil dalam cards
- [ ] Display mode shows:
  - [ ] Category name
  - [ ] Slug
  - [ ] Description
  - [ ] Edit button
  - [ ] Delete button
- [ ] Add New button works
- [ ] Add form:
  - [ ] Name field (required)
  - [ ] Slug auto-generates dari name
  - [ ] Can manually edit slug
  - [ ] Description field
  - [ ] Save button creates new category
  - [ ] Cancel button closes form
- [ ] Edit mode (inline):
  - [ ] Click edit switches to edit mode
  - [ ] Fields editable
  - [ ] Save updates database
  - [ ] Cancel restores original values
- [ ] Delete:
  - [ ] Shows confirmation
  - [ ] Removes dari database
  - [ ] Updates list immediately
- [ ] Slug validation (lowercase, no spaces)
- [ ] Error handling

### Personal Info Editor (`/admin/personal-info`)

- [ ] Protected route
- [ ] Form loads dengan existing data (jika ada)
- [ ] Profile image section:
  - [ ] Current image tampil (jika ada)
  - [ ] Upload new image works
  - [ ] Image preview tampil
  - [ ] Remove image works
- [ ] All fields editable:
  - [ ] Full name (required)
  - [ ] Title/tagline (required)
  - [ ] Bio (required)
  - [ ] Email (required)
  - [ ] GitHub URL
  - [ ] LinkedIn URL
  - [ ] Twitter URL
- [ ] URL validation works
- [ ] Save button:
  - [ ] Shows loading state
  - [ ] Updates database (atau inserts jika first time)
  - [ ] Shows success message
  - [ ] Image replacement works
- [ ] Changes reflected immediately di frontend pages
- [ ] Error handling

## Image Upload Testing

- [ ] Image upload ke Supabase Storage works
- [ ] Public URL generated correctly
- [ ] Images accessible via public URL
- [ ] Image deletion removes dari storage
- [ ] Large images handled (5MB test)
- [ ] Various formats work (PNG, JPG, WEBP)
- [ ] Error handling untuk upload failures

## Database Testing

- [ ] RLS policies enforced:
  - [ ] Public can SELECT dari all tables
  - [ ] Unauthenticated cannot INSERT/UPDATE/DELETE
  - [ ] Authenticated can INSERT/UPDATE/DELETE
- [ ] Portfolio items saved correctly
- [ ] Categories saved correctly
- [ ] Personal info saved correctly
- [ ] Timestamps (created_at, updated_at) working
- [ ] Relationships maintained (category_id references)

## Authentication Testing

- [ ] Session persists across page reloads
- [ ] Session expires setelah timeout
- [ ] Logout clears session
- [ ] Protected routes redirect correctly
- [ ] Auth state reflects di navigation (Login vs Admin link)

## Performance Testing

- [ ] Page load times acceptable (<3s)
- [ ] Image loading optimized (lazy loading)
- [ ] Navigation smooth (client-side routing)
- [ ] No console errors
- [ ] No memory leaks
- [ ] Database queries optimized

## Responsive Testing

Test di berbagai screen sizes:
- [ ] Mobile (320px - 480px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1280px+)

Verify:
- [ ] Navigation responsive
- [ ] Cards stack properly
- [ ] Forms usable di mobile
- [ ] Images scale correctly
- [ ] Text readable
- [ ] Buttons accessible

## Browser Testing

Test di:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

## Error Handling Testing

- [ ] Network errors handled gracefully
- [ ] Invalid data rejected dengan clear messages
- [ ] 404 pages work
- [ ] Database errors don't crash app
- [ ] Image upload failures handled
- [ ] Form validation errors clear

## Security Testing

- [ ] SQL injection protected (using Supabase ORM)
- [ ] XSS protected (React auto-escaping)
- [ ] CSRF tokens tidak needed (Supabase handles)
- [ ] Environment variables tidak exposed
- [ ] Admin routes protected
- [ ] Storage policies correct

## Deployment Testing (Production)

- [ ] Build succeeds tanpa errors
- [ ] Environment variables set correctly
- [ ] Database accessible dari production
- [ ] Images load dari Supabase Storage
- [ ] Authentication works di production
- [ ] HTTPS enabled
- [ ] Custom domain works (jika configured)

## Bug Tracking

Document any issues found:

| Issue | Severity | Page/Feature | Status |
|-------|----------|--------------|--------|
|       |          |              |        |

## Sign-off

- [ ] All critical features tested dan working
- [ ] No blocking bugs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation updated

**Tested by**: _______________
**Date**: _______________
**Environment**: [ ] Local [ ] Staging [ ] Production
**Notes**: _______________________________________________
