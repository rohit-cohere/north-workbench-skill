#!/bin/bash
# Scaffold a new North Workbench project
#
# Usage: ./scaffold.sh my-workbench
#
# Creates a Next.js project with:
# - Editorial design system
# - North API client + server
# - Auth (3 modes)
# - API routes
# - Data store
# - Basic app shell

set -e

PROJECT_NAME=${1:-"north-workbench"}
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Creating $PROJECT_NAME..."

# Create Next.js project
npx create-next-app@latest "$PROJECT_NAME" \
  --typescript \
  --tailwind \
  --app \
  --no-eslint \
  --no-src-dir \
  --import-alias "@/*" \
  --no-turbopack

cd "$PROJECT_NAME"

# Install dependencies
npm install class-variance-authority clsx tailwind-merge lucide-react

# Copy design system
cp "$SCRIPT_DIR/design-system/globals.css" app/globals.css

# Create directory structure
mkdir -p src/api src/hooks src/components src/lib src/types
mkdir -p app/api/north/{signin,agents,chat,executions}
mkdir -p "app/api/north/executions/[executionId]"
mkdir -p "app/api/north/executions/[executionId]/nodes/[nodeSelector]"

# Copy code blocks
cp "$SCRIPT_DIR/code-blocks/auth/north-client.ts" src/api/northClient.ts
cp "$SCRIPT_DIR/code-blocks/auth/north-server.ts" src/api/northServer.ts
cp "$SCRIPT_DIR/code-blocks/data/data-store.ts" src/lib/data-store.ts

echo ""
echo "✓ $PROJECT_NAME created!"
echo ""
echo "Next steps:"
echo "  cd $PROJECT_NAME"
echo "  npm run dev"
echo ""
echo "Then add your domain-specific:"
echo "  - Agent configs (src/api/agents.ts)"
echo "  - Agent prompts (src/api/agentService.ts)"
echo "  - Views (src/components/)"
echo "  - Types (src/types/)"
