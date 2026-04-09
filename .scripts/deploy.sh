#!/usr/bin/env zsh
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
APPROVED_FILE="$REPO_ROOT/approved.yaml"

if [ ! -f "$APPROVED_FILE" ]; then
  echo "Error: approved.yaml not found at $APPROVED_FILE" >&2
  exit 1
fi

# Read folder names from approved.yaml
FOLDERS=("${(@f)$(yq e '.folders | keys | .[]' "$APPROVED_FILE")}")

if [ ${#FOLDERS[@]} -eq 0 ]; then
  echo "Error: No folders found in approved.yaml" >&2
  exit 1
fi

echo "Select a sheet to deploy:"
echo ""
for i in {1..${#FOLDERS[@]}}; do
  printf "  %d) %s\n" "$i" "${FOLDERS[$i]}"
done
echo ""

read -r "CHOICE?Enter number (1-${#FOLDERS[@]}): "

if ! [[ "$CHOICE" =~ ^[0-9]+$ ]] || [ "$CHOICE" -lt 1 ] || [ "$CHOICE" -gt ${#FOLDERS[@]} ]; then
  echo "Error: Invalid selection" >&2
  exit 1
fi

SELECTED="${FOLDERS[$CHOICE]}"
echo ""
echo "Deploying: $SELECTED"
gh workflow run "Deploy on PR Merge" -f "folder=$SELECTED"
echo "Workflow triggered. View status: gh run list --workflow=deploy-on-merge.yml"
