read -sp "Enter your MySQL Username (Default root): " DB_USER
echo
read -sp "Enter your MySQL password: " DB_PASSWORD
echo

cat > .env <<EOF
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=InsnapDB
EOF
echo ".env file created."

npm install

mysql -u "$DB_USER" -p"$DB_PASSWORD" < InsnapDB.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" < UserActivityInit.sql


