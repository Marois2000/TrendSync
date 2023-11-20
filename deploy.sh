echo "Switching to branch master"
git checkout master

echo "Building app..."
cd client
npm run build

echo "Deploying files to server..."
scp -r dist/* tyler@97.107.128.158:/var/www/97.107.128.158/

echo "Done deploying frontend!"


echo "Deploy the Server? (y/n):"
read server

if [ "$server" == "y" ]; then
    echo "Starting api deployment"
    cd ..
    scp Server/*.js tyler@97.107.128.158:/home/tyler/api
fi


echo "Done!"