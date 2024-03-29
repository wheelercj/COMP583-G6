# MakeMeShort

Make links easier to share, and see clickthrough rates and approximate geographic locations of clicks.

[makemeshort.buzz](https://makemeshort.buzz/)

## dev environment setup

1. Navigate in a terminal to where you want the project's folder to appear.
2. Download the code with `git clone https://github.com/wheelercj/COMP583-G6.git`.
3. Download the dependencies with `npm install`.
4. If you want to be able to run the web server locally for testing, you will need to create a MySQL database and a `.env` file in the project's root with these environment variables: `DB_HOST`, `DB_PASSWORD`, `DB_USER`, `DB_NAME`, `DB_PORT`, and `DB_SSL`. 

Now just use the `nodemon` command to run the server! If you get an error message about the command not being recognized even after restarting the terminal, you may need to install nodemon globally with `npm install -g nodemon`.

## resources

* [API endpoints](https://github.com/wheelercj/COMP583-G6/blob/main/docs/routes.md)
* [our database schema](https://github.com/wheelercj/COMP583-G6/blob/main/docs/schema.sql)
* [how our web server was set up](https://github.com/wheelercj/COMP583-G6/blob/main/docs/server-setup.md)
* [project Jira](https://mooshi.atlassian.net/jira/software/projects/CG/boards/1)
* [project Google Drive](https://drive.google.com/drive/folders/1WSS3t4vA2GgMH0W6S3wUn9kD_YjLJNu4?usp=sharing)
* [getting started with Git and GitHub](https://wheelercj.github.io/notes/pages/20210907144216.html)
