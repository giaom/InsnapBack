# Insnap Setup

Install MySql Community Server from https://dev.mysql.com/downloads/mysql/

Remember your password and if you installed as a local or root user. 

Git Clone our project

`git clone https://github.com/giaom/InsnapBack`

`cd InsnapBack`

`cd InsnapFront`

`git clone https://github.com/giaom/InsnapFront`

`cd ..`

And now run out setup script:

`./runit.sh`

[runit.sh](http://runit.sh) will prompt you to enter your MySql user and password. Enter root if the server is running as the root user. 

Insnap is now running on your machine! Now lets make an account and sign in.

Currently you wont see any other accounts, which is why we want to run a script that will mimic user behavior. To do this run:

`./useractivity.sh`

Now we you can see and interact with posts and other users!