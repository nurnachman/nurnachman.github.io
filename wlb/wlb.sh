#!/bin/bash

# wlb - Work Life Balance Timer
# 30 minutes work, 30 minutes break, repeat

# Default configuration
WORK_DURATION=1800  # 30 minutes in seconds
BREAK_DURATION=1800 # 30 minutes in seconds
SOUND_ENABLED=false
SOUND_CMD="afplay /System/Library/Sounds/Glass.aiff"

# Parse command line options
while getopts "w:b:sc:h" opt; do
  case $opt in
    w)
      WORK_DURATION=$((OPTARG * 60))
      ;;
    b)
      BREAK_DURATION=$((OPTARG * 60))
      ;;
    s)
      SOUND_ENABLED=true
      ;;
    c)
      SOUND_CMD="afplay /System/Library/Sounds/${OPTARG}.aiff"
      ;;
    h)
      echo "Usage: $0 [-w minutes] [-b minutes] [-s] [-c sound]"
      echo ""
      echo "Options:"
      echo "  -w    Work duration in minutes (default: 30)"
      echo "  -b    Break duration in minutes (default: 30)"
      echo "  -s    Enable sound notifications"
      echo "  -c    Sound name (default: Glass)"
      echo "        Available: Basso, Blow, Bottle, Frog, Funk, Glass,"
      echo "                   Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink"
      echo "  -h    Show this help"
      echo ""
      echo "Examples:"
      echo "  $0                    # 30 work, 30 break, no sound"
      echo "  $0 -w 25 -b 5 -s      # 25 work, 5 break, with sound"
      echo "  $0 -s -c Ping         # Default times with Ping sound"
      exit 0
      ;;
    \?)
      echo "Usage: $0 [-w minutes] [-b minutes] [-s] [-c sound] [-h]"
      echo "Use -h for help"
      exit 1
      ;;
  esac
done

# Function to format time as MM:SS
format_time() {
  local total_seconds=$1
  local minutes=$((total_seconds / 60))
  local seconds=$((total_seconds % 60))
  printf "%02d:%02d" $minutes $seconds
}

# Function to play sound
play_sound() {
  if [ "$SOUND_ENABLED" = true ]; then
    $SOUND_CMD &
  fi
}

# Clear screen and hide cursor
clear
tput civis

# Trap to restore cursor on exit
trap 'tput cnorm; echo; exit' INT TERM EXIT

echo "wlb timer started"
echo "Press Ctrl+C to quit"
echo ""

# Counters
work_count=0
break_count=0

# Main loop
while true; do
  # WORK phase
  ((work_count++))
  for ((remaining=WORK_DURATION; remaining>=0; remaining--)); do
    tput cup 3 0
    echo -e "\033[1;32m WORK \033[0m  $(format_time $remaining)   W:$work_count B:$break_count  "
    sleep 1
  done
  play_sound
  
  # BREAK phase
  ((break_count++))
  for ((remaining=BREAK_DURATION; remaining>=0; remaining--)); do
    tput cup 3 0
    echo -e "\033[1;36m BREAK\033[0m  $(format_time $remaining)   W:$work_count B:$break_count  "
    sleep 1
  done
  play_sound
done