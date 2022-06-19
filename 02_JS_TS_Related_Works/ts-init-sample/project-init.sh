echo "-------------------------------"
echo "|                             |"
echo "|         npm install         |"
echo "|                             |"
echo "-------------------------------"
npm install

echo "------------------------------------"
echo "|                                  |"
echo "|         npm i -g sqlite3         |"
echo "|                                  |"
echo "------------------------------------"
npm i -g sqlite3    

echo "--------------------------------------------------"
echo "|                                                |"
echo "|         move sqlite3 into node_modules         |"
echo "|                                                |"
echo "--------------------------------------------------"
cp -r $(npm config get prefix)/node_modules/sqlite3 ./node_modules

if [ $? -eq 0 ]
then
    echo "success to move sqlite3 module"
else
    echo "fail to move sqlite3 module"
fi