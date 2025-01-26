# Resources

I also will compile a list of resources that I used to complete this project. I have

- never setup a home server
- never done any form of frontend web development
- never done any frontend design
- never made a vscode extension

so I think it would also be helpful to know what I used to actually learn how to do all of this.

## Home Server
I don't want to pay for an AWS machine for my senior project that will probably be used by a total of 5 people. So, I want to take some old laptops that the lovely Besser Company gave me to create my own home server. <br>
Below are the specs for both laptops (they're the same model)

Processor: __Intel i5-2520M 2.50GHz__ <br>
RAM: __4GB__

so uhhhhh, yeah they're pretty ass. Which means you shouldn't have any issue finding cheap equivalents.

## The very beginning

**ChatGPT** is the first resource I use for pretty much anything. Before any project I braindump every single thing I'm considering into an LLM. I don't have it write an code, I don't have it solve any issues, I just want to know what I need for my specific application.

From there, I watched these youtube videos:
1. Why not to host your own server: https://youtu.be/URWlY3Qr9l8?si=AHPFoeVhQ5BfgTHE
2. What to look for when hosting your own server: https://youtu.be/5FVsJYsuBCQ?si=ROFsY6Y-MEjCb7tF
3. How to setup Ubuntu server: https://youtu.be/K2m52F0S2w8?si=aYFQNAzgSUQVIA_5
4. This article to create the ISO on a usb driver: https://ubuntu.com/tutorials/create-a-usb-stick-on-windows#1-overview
5. This repo on security of home servers: https://github.com/imthenachoman/How-To-Secure-A-Linux-Server
6. Made the ip static: https://www.freecodecamp.org/news/setting-a-static-ip-in-ubuntu-linux-ip-address-tutorial/

It took me a few hours in total but I got both machines up and running and successfully SSH'd into them.

Before I open them up to the public, I need to figure out setting them both up on VLAN's so that even if I mess up some form of security, my parents personal devices on the internet aren't affected.

So now I got the servers setup but the router I was using didn't support VLAN configurations, so I will have to wait for the new one to come in and help my parents set it up over FaceTime.

While trying to set it up the first time, I broke out wifi and it only took 2 hours to fix! But it's pretty easy, you just add a VLAN group and add the ports that you have your servers connected to, I'll update the extra security precautions I took once I finish the setup.

## Frontend

Again, **ChatGPT** is the first source of information. I just explained exactly what I wanted out of my application, and asked what a complete beginner would have to do to accomplish this goal.

From there, I read through these:
1. HTML semantic elements: https://www.w3schools.com/html/html5_semantic_elements.asp
2. CSS basics: https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Styling_the_content
3. CSS selectors: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors
4. CSS gridbox intro: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
5. Video on CSS intuition: https://youtu.be/i1FeOOhNnwU?si=uMwTzmScS4bN4qaP
6. A cool cheat sheet for flex boxes: https://yoksel.github.io/flex-cheatsheet/
7. A setup for Next.js https://www.youtube.com/watch?v=AaQfCKJLMGY
8. images and fonts: https://nextjs.org/docs/app/getting-started/images-and-fonts

This got me to the point of creating the landing page for Serpent. Note, I took the default landing page, referenced the documentation listed above, and went through line by line asking ChatGPT to explain anything I didn't understand. A list of dumb questions I asked:

- What do I say yes and no to on the initial Next.js project setup questions?
- What are the best practices for structuring my directories
- Can I name my pages something other than page.tsx?
- Where do I put my API's if not in the app directory

Along the way, I also created a logo, it's just the symbol 'Delta' with two oval's as eyes.

I would say that this concludes the very basics of frontend for me, so here are a couple things that I learned at this milestone.

__Next.js is Node.js__—This one is funny because I literally had no clue that one of the selling points of Next.js was the fact that it has full-stack capabilities. This caused me to delete my front and backend repo's and create a new single repo to make my app.

__Free Tier of Canva sucks__—Thats all, I used Draw.io and then imported into canva just to get dimensions right, god Canva sucks.

__Next.js structure__—It's pretty cool that Next.js lets you structure your app so cleanly. I'm sure it's the standard but having your main 'app' directory that holds your home page, your global styles, etc, and then subdirectories to hold other pages of your app along with component folders for each is very intuitive.

And that's about all for the very beginning. I really did only visit those 8 links, truly just use ChatGPT. Don't have it write anything for you, just ask it literally anything that you don't understand. Yeah—it's bad at math and can't write complex things for you in one query, but one thing it's good at is regurgitating documentation in a more digestible format.




## Backend

Yet again I start with **ChatGPT**—you know the drill.

1. Figuring out GitHub's API usage: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-with-a-github-app-on-behalf-of-a-user
2. how to use Next properly: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
3. https://stackoverflow.com/questions/75418329/how-do-you-put-api-routes-in-the-new-app-folder-of-next-js

Okay so now I had to import over the leetcode api routes [from my other repo](https://github.com/abrege11/leetcode-api), which were modified from the posts below.
4. https://leetcode.com/discuss/general-discussion/1297705/is-there-public-api-endpoints-available-for-leetcode
5. https://www.reddit.com/r/leetcode/comments/14dn47v/leetcode_api/
Likewise it was a long time ago, but I think I glanced at this repo as well:
6. https://github.com/alfaarghya/alfa-leetcode-api
Regardless, these people are way smarter than me and I merely translated their knowledge so check them out for more information on the api's.

I just got done creating the database and adding in the tables for leetcode and github data. I didn't lookup anything to complete this as I interned as a backend engineer at Northcross Group-so I already had a good understanding of what to do. However, in light of the entire point of this document, I'll list a couple things that I think would help a beginner-
- It's okay to add database information in your repo, but NEVER commit any form of credentials to sign in, put them in a .env file that you pull from. Not only is this a security procedure, it also helps with production vs development environments as you can simple change the env variable instead of changing every instance.
- Use UUID's for primary keys !!! not integers. It's too easy to guess integer id's and it creates vulnerabilities in your app.
- Asking chatGPT or looking up a youtube video will get you going fast, you just download youre database of choice—SQL in my case, and create a schema/database which you will add your tables too. Look in /serpent/serpent-app/db/db.init.js to see how to use JavaScript to connect to and query your database. It's pretty straight forward.
- The structure is honestly all holistic, I'm sure I violated many principles of table structuring (because I did) and you couldn't pay me to give a shit. If you're at a company OF COURSE adhere to their preferences, but at the end of the day they're no more than that: preferences. Obviously you want to normalize when possible, avoid redundant columns and information between tables blah blah blah, but it just doesn't matter. For example, when creating Antibiotic software for NMU we started by modeling the database around the data, specimens, users, patients, etc. As I started developing more and actually __using__ the data in the database, the JOIN queries to fetch data were a nightmare, so instead I just made a table for each screen. Is this the 'right' way? No, and here's a test for you narcs, it's fill in the blank and strictly pass fail: 'I don't give a ___'. Lucky for you, if you put any profane word in there, you passed!!!!! But you get it. As long as your database is secure, make it easy to use for your application.

## 1/13/25
Now adding dates to hopefully help the timeline a bit, now I'm adding authentication. My goal is to get OAuth and GitHub's API working before my calc 3 class at 1pm. First
- https://support.google.com/cloud/answer/6158849?hl=en
This got me setup with my client id, now I'm using this link:
- https://developers.google.com/identity/protocols/oauth2
I read through this and clinked the link related to client-side (javascript) applications as that is what applied to me.
- https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
From here, I decided to go with next-auth: https://next-auth.js.org/getting-started/example because it's easy, so the implementation of what I used to get setup is at that link.

Okay so prompted with ChatGPT a bit because I was getting weird errors, and sure enough, use pages/api not app/api because next-auth doesn't like app routing. This might save you 20 minutes of confusion...

## 1/14/25
Created and submitted my proposal which can be found in proposal.md in the root of the project. Along with that, I created the frontend for the preferences screen pictured in the README. In all honesty, I didn't track what I did, I was in a rush and had to move on, but that's all for today.

## 1/17/25
As I've tried to fall asleep these last couple nights, I've begun to realize how much I bit off, and if I can chew it all. The answer is yes, but not how I'm going about it right now. Let me explain.

A full scale web application as a solo developer is no small task, on top of that, I have until late April to get it done. This has been stressing me out, but I'm doing it to myself. The thing is that I don't know frontend, so why do it? I find myself trying to create the components and build these pages synchronously—mimicking a normal development cycle. However, I realized that I'm dumb, and there's no real reason to not do all of one at once, and save the other for last.

As I thought, I realize that I have these specs for what I need on the frontend, so why build it right now? I can see what data, endpoints, and helpers that I am going to need, so why not just write the entire backend right now? I'm sure there is some issue with this, and I will get bit by it, but that's what I'm going with right now. Because this development will be unorthodox, so I'm only hurting my efficiency by trying to remain orthodox.

So that brings me to now, I added the endpoints for signing up and logging in, along with the helpers that were needed.

Authentication is a huge black box, or at least it was for me, but it really isn't hard. You just need to store usernames and encrypt passwords, and of course make sure you protect your SQL queries from injection attacks. NEVER directly pass a variable into a query, instead parameterize all of your queries: https://techcommunity.microsoft.com/blog/sqlserver/how-and-why-to-use-parameterized-queries/383483.

For password encryption, I used Argon2. All you need is a helper function to hash the password and store it, and then a verifying function to check the plain text password provided against the hashed on in the database.

Some other things I ran into were the fact that people using Google's OAuth to sign in wouldn't necessarily have the first name, last name structure that I setup, neither the username, neither a password even. Knowing this, it makes sense why some companies don't let you login normally if you previously logged in with Google. Regardless, I made a quick helper function that turned a full name into a first and last name, along with a helper function that sets the users username to the name before the @ in their email.

Pretty standard, but then I realized that someones google account could match an existing username in the database. Ugh. So another quick helper function to add numbers to the end of someones username if it is already taken and they were signed up through OAuth. With that, authentication is about done, there are a few more things that I want to add but I want to move onto other parts as of now.

## 1/18/25
I added a TODO list in TODO.md to help me spec out how much I am going to have to do. Not as much when you write it down, but the little nuances of each item will kill me for sure. My next step was going to be getting the VSCode extension working, but I think I'll hold off on that for now until I get to the point where I am implementing the Tracking aspect.

I'm going to bite the bullet and try and finish designing, if you look now, which is benign because you can't see the state of the TODO as I'm writing, but there are only 3/11 pages done. I have more but I don't like the designs as I've continued the development. This is essential (unfortunately) if I actually want to be able to make the backend first. If I have good designs, I will know what I need for the backend, along with a way smoother road to implementing that on the frontend. I hate designing and I'm bad at it but it is a necessary evil for what I'm trying to do.


## 1/22/25
So not much to say, but I have finished the first dashboard screen design, and I'm starting the tracking design as well. Below is the dashboard design, going to be a lot of work to code on the frontend...
![dboad](../serpent/assets/new-dashboard.png)

## 1/25/25
Okay well school and work along with this has been busy I won't lie. But the designing is done! I finished the tracking page, view and edit sessions, along with the settings page. Now, there is a change to note that I'm taking the social aspect out of the picture for right now. There are two main reasons:
1. I need things to put that I'm going to add after it's finished
2. There's no need to allocate my time to a feature geared towards a large user base when I couldn't care less if this app gains a large user base.
With that said, design is done! I'm going to hit hard on implementing the vscode extension next. That'll be a task to learn. I already read these articles:
- https://code.visualstudio.com/api/get-started/your-first-extension
- https://www.freecodecamp.org/news/making-vscode-extension/

But all in all they weren't overly helpful for what I needed. It will be interesting to learn how to do this although it doesn't seem too crazy difficult. either way, time is ticking and I have to pick up the pace on this stuff if I want to get this done (and graduate).