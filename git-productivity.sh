#!/usr/bin/env bash

BASE_PERIOD="${1:-${BASE_PERIOD}}"
COMPARE_PERIOD="${2:-${COMPARE_PERIOD}}"

usage() {
  echo "Usage:"
  echo "  $ $0 <BASE_PERIOD: YYYY-MM> <COMPARE_PERIOD: YYYY-MM>"
  echo "or:"
  echo "  $ BASE_PERIOD=<YYYY-MM> COMPARE_PERIOD=<YYYY-MM> $0"
  exit 1
}

# Validate date format (YYYY-MM)
validate_date_format() {
  local date_str=$1
  local param_name=$2
  
  if [[ -z "$date_str" ]]; then
    echo "Error: $param_name is empty"
    return 1
  fi
  
  if [[ ! "$date_str" =~ ^[0-9]{4}-[0-9]{2}$ ]]; then
    echo "Error: $param_name '$date_str' does not match format YYYY-MM"
    return 1
  fi
  
  # Validate month range (01-12)
  local month=$(echo "$date_str" | cut -d'-' -f2)
  if [[ $month -lt 1 || $month -gt 12 ]]; then
    echo "Error: $param_name '$date_str' has invalid month (must be 01-12)"
    return 1
  fi
  
  return 0
}

# Validate both periods
if ! validate_date_format "$BASE_PERIOD" "BASE_PERIOD"; then
  usage
fi

if ! validate_date_format "$COMPARE_PERIOD" "COMPARE_PERIOD"; then
  usage
fi

set -e

echo "Working on: $(pwd)"

get_lines_changed() {
  local YEAR_MONTH=$1
  local START="${YEAR_MONTH}-01"
  local END=$(date -v+1m -v-1d -jf "%Y-%m-%d" "$START" +%Y-%m-%d)

  git log \
    --author="$(git config user.name)" \
    --since="$START" \
    --until="$END" \
    --pretty=tformat: --numstat | \
      awk '{added+=$1; deleted+=$2} END {print added+deleted}'
}

START_LINES=$(get_lines_changed "$BASE_PERIOD")
END_LINES=$(get_lines_changed "$COMPARE_PERIOD")

if [ "$START_LINES" -eq 0 ]; then
  EFFICIENCY="N/A"
else
  EFFICIENCY=$(awk "BEGIN {printf \"%.2f\", ($END_LINES - $START_LINES) / $START_LINES * 100}")
fi

echo "Lines changed in $BASE_PERIOD: $START_LINES"
echo "Lines changed in $COMPARE_PERIOD: $END_LINES"
echo "Efficiency change: $EFFICIENCY%"

