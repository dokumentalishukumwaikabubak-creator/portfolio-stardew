#!/bin/bash
# Database Setup Script untuk Supabase
# Usage: bash setup-database.sh

set -e

echo "========================================="
echo "  Supabase Database Setup Script"
echo "========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "ERROR: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx"
    exit 1
fi

# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "ERROR: Supabase credentials not found in .env.local"
    exit 1
fi

echo "Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Function to execute SQL
execute_sql() {
    local sql_file=$1
    echo "Executing: $sql_file"
    
    # Read SQL file
    sql_content=$(cat "$sql_file")
    
    # Execute via Supabase REST API
    response=$(curl -s -X POST \
        "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql" \
        -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
        -H "Authorization: Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -d "{\"query\": $(echo "$sql_content" | jq -Rs .)}")
    
    echo "Response: $response"
    echo ""
}

echo "Running database migrations..."
echo ""

# Run migrations
if [ -f "supabase/migrations/001_initial_schema.sql" ]; then
    echo "Migration 1: Initial Schema"
    echo "Please run this SQL in Supabase SQL Editor:"
    echo ""
    cat supabase/migrations/001_initial_schema.sql
    echo ""
    read -p "Press Enter after running migration 1..."
fi

if [ -f "supabase/migrations/002_storage_setup.sql" ]; then
    echo "Migration 2: Storage Setup"
    echo "Please run this SQL in Supabase SQL Editor:"
    echo ""
    cat supabase/migrations/002_storage_setup.sql
    echo ""
    read -p "Press Enter after running migration 2..."
fi

echo ""
echo "========================================="
echo "  Database Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Create admin user in Supabase Dashboard"
echo "2. Run: pnpm dev"
echo "3. Login at: http://localhost:3000/admin/login"
echo ""
