#!/bin/bash
# Script to create admin user in Firebase Console
# Run this in Firebase Functions shell or use the Firestore console to manually create

# Admin User Template
# Copy and paste this into Firestore Console under collection 'users' with document ID = user's UID

cat << 'EOF'
{
  "id": "YOUR_UID_HERE",
  "uid": "YOUR_UID_HERE",
  "email": "admin@empresa.com",
  "fullName": "Administrator",
  "role": "super_admin",
  "companyId": "empresa-001",
  "status": "active",
  "createdAt": "2026-04-28T00:00:00.000Z",
  "updatedAt": "2026-04-28T00:00:00.000Z",
  "lastActive": "2026-04-28T00:00:00.000Z"
}
EOF

echo ""
echo "Steps to create admin user:"
echo "1. Sign up a user in the app with email: admin@empresa.com"
echo "2. Create a company document (optional):"
echo ""
echo '{
  "id": "empresa-001",
  "name": "Mi Empresa",
  "taxId": "900.000.000-0",
  "status": "active",
  "subscription": {
    "plan": "enterprise",
    "status": "active"
  },
  "createdAt": "2026-04-28T00:00:00.000Z"
}'
echo ""
echo "3. In Firestore Console, navigate to 'users' collection"
echo "4. Find the document with your user's UID"
echo "5. Update the 'role' field from 'viewer' to 'super_admin'"
echo "6. Set 'companyId' to 'empresa-001'"
echo ""
echo "Done! User is now admin."
