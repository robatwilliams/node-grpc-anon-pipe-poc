echo "Before loop"

while IFS= read -r string; do
    echo "Thanks for the $string"
done