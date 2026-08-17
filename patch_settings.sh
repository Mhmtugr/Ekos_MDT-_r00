#!/bin/bash
# Remove togglePasswordVisibility
sed -i '/const togglePasswordVisibility/,/};/d' src/components/Settings.tsx
# Remove visiblePasswords state
sed -i '/const \[visiblePasswords, setVisiblePasswords\] = useState/d' src/components/Settings.tsx
