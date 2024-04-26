# Clean up old executables
rm -rf /srv/duckbot_webapp/node_modules;
rm -rf /srv/duckbot_webapp/dist;
rm -rf /srv/duckbot_webapp/.git;
rm -rf /srv/duckbot_webapp/src;

# Replace with the new version
unzip -o duckbot_webapp.zip -d /srv/duckbot_webapp;
rm -f duckbot_webapp.zip;
cd /srv/duckbot_webapp;

# Build new version, run migrations and launch
yarn install;
yarn build;

# Remove build script
rm -f install.sh;