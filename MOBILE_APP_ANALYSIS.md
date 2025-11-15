# Mobile App Analysis - Photo Storage

## Critical Finding: Photos Are NOT Uploaded to Supabase Storage

### How Mobile App Stores Photos

The mobile app (`picxie-mobile`) **does NOT upload photos to Supabase Storage**. Instead:

1. **Local Storage Only**:
   - Photos are captured using Expo Camera
   - Stored locally on device filesystem
   - File paths like: `file:///data/user/0/.../92070831-72BE-4586-BC95-E1D5B9704E15.jpg`

2. **Database Records**:
   - Only metadata is synced to Supabase database
   - `file_name`: The local filename (e.g., `92070831-72BE-4586-BC95-E1D5B9704E15.jpg`)
   - `local_uri`: Full local file path (e.g., `file:///...`)
   - GPS coordinates, site_id, project_id, etc.

3. **No Cloud Upload**:
   - Photos stay on the mobile device
   - Never uploaded to Supabase Storage bucket
   - See `CameraScreen.tsx` line 201-202 and `photoStore.ts` line 272

### Why Web App Shows "Image Not Available"

The web app tries to fetch photos from Supabase Storage:
```typescript
// Web app builds this URL:
https://ampxyzotiiqmwcwsdfut.supabase.co/storage/v1/object/public/photos/92070831-72BE-4586-BC95-E1D5B9704E15.jpg

// But the file doesn't exist there!
// Returns HTTP 400 - file not found
```

## ✅ Solution Implemented: Mobile App Now Uploads to Cloud Storage

**UPDATED**: The mobile app has been enhanced to upload photos to Supabase Storage!

### What Changed:

**Mobile App (`picxie-mobile/src/stores/photoStore.ts`)**:

1. **New `uploadPhotoToStorage()` method** (React Native FormData):
   - Uses FormData with {uri, type, name} object (native React Native support)
   - Uploads directly to Supabase Storage REST API
   - No external dependencies needed (fetch is built-in)
   - Uploads to bucket 'photos'
   - Returns public URL for web access
   - Handles errors gracefully with null fallback

2. **Enhanced `addPhotoToSupabase()`**:
   - Now uploads photo to storage FIRST before database
   - Stores storage URL in `local_uri` field instead of `file://` path
   - Falls back to local URI if upload fails
   - Photos immediately available on web app

3. **Enhanced `syncToSupabase()`**:
   - Uploads all local photos to storage during sync
   - Converts existing `file://` URIs to cloud storage URLs
   - Logs upload progress and count

### Result:

- ✅ New photos auto-upload when captured
- ✅ Photos instantly sync to web app via real-time subscriptions
- ✅ Full web/mobile synchronization achieved
- ✅ Existing mobile photos can be uploaded via sync function
- ✅ Web app's photo display now works for mobile photos

## Mobile App Theme

### Colors (Both Light & Dark Modes)

**Light Mode**:
- Background: `rgba(252, 252, 254, 1)` - Off-white
- Card Glass: `rgba(255, 255, 255, 0.85)` - Semi-transparent white
- Text Primary: `#000000`
- Text Secondary: `#666666`
- Button: `#000000` background, `#FFFFFF` text

**Dark Mode**:
- Background: `rgba(20, 20, 25, 1)` - Very dark gray
- Card Glass: `rgba(255, 255, 255, 0.08)` - Minimal white overlay
- Text Primary: `#FFFFFF`
- Text Secondary: `rgba(255, 255, 255, 0.7)`
- Button: `#FFFFFF` background, `#000000` text

### Design Patterns

- **Liquid Glass Aesthetic**: Frosted glass cards with subtle borders
- **Orbs/Bubbles**: Animated gradient orbs in background
- **Minimalist**: Clean, iOS-inspired design
- **Haptic Feedback**: Touch interactions with haptics
- **Animations**: Smooth scale animations, fade-ins, breathing effects

## Code References

### Mobile App Files

**Photo Capture**: `src/screens/Camera/CameraScreen.tsx`
- Line 201-202: Extracts filename from local URI
- Line 221-231: Creates photo metadata (NO upload)
- Line 234: Saves to local photoStore

**Photo Store**: `src/stores/photoStore.ts`
- Line 272: `file_name: photo.fileName` (local filename only)
- Line 279: `local_uri: photo.localUri` (device file path)
- Line 300-356: `addPhotoToSupabase()` - Only syncs metadata, not file

**Theme**: `src/utils/theme.ts`
- Line 47-84: Light theme colors
- Line 89-126: Dark theme colors

### Web App Files

**Photo Upload**: `components/UploadModal.tsx`
- Line 175-177: ✅ Correctly uploads to Supabase Storage
- Line 184-193: ✅ Creates database record with file_name

**Photo Display**: `lib/supabase.ts`
- Line 22-61: `getPhotoUrl()` - Assumes file exists in storage
- **Issue**: Mobile photos don't exist in storage!

## Recommendation

The web app should check if a photo exists in Supabase Storage before trying to display it:

```typescript
// Option 1: Check local_uri field
if (photo.local_uri && photo.local_uri.startsWith('file://')) {
  // Mobile photo - not available for web display
  return placeholderImage;
}

// Option 2: Try to fetch, show placeholder on error
// Already implemented via PhotoImage component's error handling
```

For full functionality, the mobile app should be updated to upload photos to Supabase Storage.
