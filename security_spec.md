# Security Specification - Vashishth Design Studio

## 1. Data Invariants
- A **Consultation** must have a name, phone, service, status, and createdAt timestamp.
- A **ContactMessage** must have a name, email, phone, message, and createdAt timestamp.
- Only authorized admins can read, update, or delete consultations and contact messages.
- Public users can only create (submit) consultations and contact messages.
- Status updates on consultations can only be performed by admins.

## 2. The "Dirty Dozen" Payloads (Denial Expected)
1. **Unauthenticated Read**: Attempt to list `/consultations` without being signed in.
2. **Identity Spoofing**: Attempt to create a consultation with a fake `createdAt` (client-side timestamp).
3. **Ghost Field Insertion**: Attempt to create a consultation with an extra field `isVerified: true`.
4. **Unauthorized Update**: A non-admin user attempting to change a consultation's status to 'completed'.
5. **Unauthorized Delete**: A non-admin user attempting to delete a consultation.
6. **Malicious ID**: Attempting to create a document with a 2KB string as ID.
7. **Type Poisoning**: Attempting to set `phone` as a boolean instead of a string.
8. **Size Attack**: Attempting to set `name` to a 1MB string.
9. **PII Leak**: Attempting to `get` a specific consultation document as a non-admin.
10. **Admin Self-Promotion**: A user attempting to add themselves to the `/admins` collection.
11. **Status Shortcut**: Updating a status directly to 'completed' without the required admin check.
12. **Blanket Query**: Attempting to list all consultations with `allow list: if isSignedIn()` (if it were implemented that way).

## 3. Test Runner (Conceptual)
All tests above MUST return `PERMISSION_DENIED` for unauthorized users.
