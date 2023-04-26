# how I set up the DigitalOcean droplet for COMP 583

1. [Set up a Production-Ready Droplet](https://docs.digitalocean.com/tutorials/recommended-droplet-setup/)
2. [How to Add Domains](https://docs.digitalocean.com/products/networking/dns/how-to/add-domains/)
3. [Pointing Your Domain to Hosting With A Records](https://kb.porkbun.com/article/54-pointing-your-domain-to-hosting-with-a-records) using the droplet's IP address.
4. [Initial Server Setup with Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-22-04)
5. [How To Install Nginx on Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04). With this, the http site started working but not https.
6. [How To Secure Nginx with Let's Encrypt on Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-22-04)
7. For pointing Nginx to a Node.js server, I compared a bunch of guides (below) and picked the parts that kind of made sense.
    * [Quick Tip: Configuring NGINX and SSL with Node.js](https://www.sitepoint.com/configuring-nginx-ssl-node-js/)
    * [Node.js + Nginx - What now?](https://stackoverflow.com/questions/5009324/node-js-nginx-what-now)
    * [How to Configure Nginx as a Reverse Proxy for Node.js Applications](https://betterstack.com/community/guides/scaling-nodejs/nodejs-reverse-proxy-nginx/)
    * [How to use Nginx as a reverse proxy for a Node.js server](https://blog.logrocket.com/how-to-run-a-node-js-server-with-nginx/)
8. `cd ~`
9. Clone the repo with `git clone https://github.com/wheelercj/COMP583-G6.git`.
10. `npm install`
11. `vim .env`
12. Copy the contents of the local .env file to the new remote one.
13. Change the port Nginx directs requests to from 3000 to 3306
14. `sudo service nginx restart`
15. `sudo nginx -t` (not `nginx -t` since root permissions are needed) to test the configuration
16. [How To Deploy Node.js Applications Using Systemd and Nginx](https://www.digitalocean.com/community/tutorials/how-to-deploy-node-js-applications-using-systemd-and-nginx)
    * I named the service `/etc/systemd/system/url-shortener.service`
    * I used my own linux user and group instead of creating a new one for the service
    * the `[Service]` section of the `url-shortener.service` file requires `EnvironmentFile=` followed by the path to the `.env`

## misc

* [Getting Started with Express](https://expressjs.com/en/starter/installing.html)
* [Express/Node introduction](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction)
* [How To Deliver HTML Files with Express](https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files)
* [Tutorial — Handling endpoints in Node.js and Express](https://medium.com/@wlodarczyk_j/tutorial-handling-endpoints-in-node-js-and-express-ce26cb550c28)
