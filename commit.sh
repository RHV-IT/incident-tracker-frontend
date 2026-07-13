set -e

echo "staging changes"

read -p "enter commit message: " message
git commit -am "$message"

echo "pushing changes"
git push

clear
