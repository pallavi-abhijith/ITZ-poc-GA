Lawrence Ng
5:06 PM
git fetch -a
git checkout backend
git pull
Lawrence Ng
5:07 PM
git status
Lawrence Ng
5:19 PM
./build-images-dev.sh
Lisa Revelli
5:21 PM
Yes, updating our computers for MVP is on the list
Lawrence Ng
5:31 PM
./deploy-stack-dev.sh
Lawrence Ng
5:38 PM
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
Lawrence Ng
5:44 PM
choco install kubernetes-helm