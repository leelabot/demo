#!/bin/bash

# Add changes
git add ./

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "No changes to commit. Skipping deployment."
    exit 0
fi

# Commit and push
git commit -m "whee"
git push

# # Deploy with vercel
# vercel --prod
