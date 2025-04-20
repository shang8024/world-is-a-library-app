# Final Report - World-Is-a-Library-app

url: https://world-is-a-library-app.vercel.app/

github: https://github.com/shang8024/world-is-a-library-app

## Vedio Demo

https://www.youtube.com/watch?v=31krK0yJ1Bc

## Motivation

n the realm of serialized fiction, particularly within niche and geographically dispersed fan communities, a significant challenge persists: the lack of timely feedback and interaction. This gap often leads to diminished motivation among emerging authors and a sense of disconnection among readers. New authors may find it difficult to sustain their creative endeavors without immediate engagement, while readers might feel detached from the narrative and the broader community. This disconnect can result in unfinished works and a declining readership, ultimately hindering creativity and the growth of vibrant fan communities.​

Our project seeks to address this critical issue by developing a fan-centric community platform tailored specifically for serialized fiction. Drawing inspiration from established platforms, our platform aims to enhance the reading and writing experience through features designed to foster engagement and community interaction.

## Objectives

The primary objective of this project is to create a fan-centric community platform tailored for fiction enthusiasts, with a focus on fostering engagement between authors and readers through innovative features like stress-less writing. The web app should have basic functionality for authors to create fiction works and edit chapters, and for readers to search, tag, view and comment. 

## Technical Stack
- Next.js Full stack
- Frontend:
    - component library: shadcn/ui, radix-ui
    - styling: Tailwind CSS
    - Responsive design are implemented with tailwind display sizes (default for mobile, sm and md for tablet, lg for desktop)
- Database: PostgreSQL v17 with prisma ORM
    - production: Digital Ocean PostgreSQL v17 database cluster
- Cloud Storage: Digital Ocean spaces
- External APIs
    - better-auth for authentication
    - Resend for sending email verfication link
    - aws-sdk for file uploading
    - Lexical for text editor

## Features
What are the main features offered by your application? Describe how they fulfill the course requirements and achieve your project objectives.

1. User Authentication and Authorization
- Sign-Up & Login: Users can register and log in using their email addresses. Upon registration, a unique user ID is generated based on the username.​

- Email Verification: In production environments, a verification link is dispatched to the user's email to confirm their identity.​

- Session Management through middleware: Access to protected routes (e.g., '/dashboard') is restricted to authenticated users. Unauthorized attempts are appropriately blocked or redirect to login

2. Public Access Features (Pre-Login)

- View/seach/sort book list
- View/search/sort sereis and books, and view user's statistics on a user's profile page
- Chapter View:
    -Layout: Displays book information at the top, followed by the current chapter content.
    - Navigation: Provides buttons to navigate to the previous or next chapters.​

3. Authenticated User Features (Post-Login)
- A dashboard to view and manage existing series and books
- Upload book cover Image, create/edit book information
- Use a chapter editor to write/edit chapters

4. Responsive Design throughout app(Mobile, Tablet, Desktop)

The platform is optimized for various devices, ensuring a consistent and user-friendly experience across devices.


The app implemnts better-auth authentication including  sessions, cookies, email verification. And applied complete session validation check through middleware and before performing sensitive server actions. Authorization check through middleware (check if session cookie exist) and on rendering (check if uid exist and match) ensures that users can only access resources they are permitted to, such as restricting access to draft chapters to their respective authors, restricting access to dashboard and book edit before login.

The application employs advanced state management techniques like React Context to ensure a responsive and dynamic user interface. Features like real-time search filtering, dynamic view toggling, and responsive design adaptations enhance user experience.

There are also integration with external services, such as cloud storage providers for handling image uploads, and email sender for sending verification emails.



## User Guide

- Auth:
    - User can sign up with email on '/signup' page, on signup, an unique userid will be assigned to user according to their username.
      
      (Production) an email verification link will be sent to the registered email.

    - User can login with email on '/login' page, on login, user will be redirected to '/dashboard'
      
      (Production) Login will fail if the user's email hasn't been verified

    - (Production) After entering email on '/forgot-password' page, user can get a reset link to reset their password.

    - Session control: Unauthorized access will be blocked (e.g. when user are trying to accesss /dashboard features before login; or when user trying to access a draft chapter by other authors, etc.)

- Before login:
    - Gloabally, when user scroll down, there will be a button scroll them back to top of the page.
    - User can view the landing page '/'
    - On '/books'
        - User can search books by a search box, and apply sorting options('createdAt', 'updatedAt'(default), 'title', 'wordCount'). There is also a pagination tool.
        - On search result, user can see a list view of Book items, including the coverImage, title, author, description, wordCount, chapters count, updatedAt and CreatedAt
        - Clicking on coverImage or title will redirect user to '/books/[bid]'
        - Clicking on author will redirect user to '/users/[uid]'
    - On '/books/[bid]': it will redirect user to the first chapter of the book
    - On '/books/[bid]/chapters/[cid]'
        - Users should see book info at top of the page, and current chapter at below
        - At bottom, there will be two button nevigate user to next or previous chapter
    - On '/users/[uid]
        - Viewers can see the statistic of the user with [uid]
        - Viewers can see a list of collapsible series with list of books
        - Viewers can sort/search the sereies or books with the search bar and sortby select box
        - Viewers can toggle view mode between list view or card view
        - If the viewers are also the author, they will also see the books tagged 'draft'
- After login:
    - On '/dashboard', similar as '/users/[uid] with extra features:
        - On mobile view, there is a carousel view, so author can scroll horizontal to view and select the book
        - aside each series, there is an edit button and a delete button, so that author can make change with series name or delete it
        - below search bar, there is a textbox and button to create series; and also a button to '/dashboar/create-book' page
        - On each book card,
            - there is a tag 'draft' to differentiate unpublic book from public books
            - Clicking on the book card will open a chapters editor, '/dashboard/book-editor/[bid]'
            - under book card, there is a edit button to '/dashboard/books/edit-book' page, and a button to delete book
    - On Edit-book and Create Book page
        - User can edit the title, description, toggle visibility
        - User can upload book cover Image to cloud storage
    - On Chapter editor page '/dashboard/book-editor/[bid]/chpters'
        - on mobile view, it is the menu page for seleting chapters to edit
        - on desktop/tablet view, the chapter index menue is resizable aside, on select a chapter will redirect user to '/[cid]' page,
            and the main view will change to the chapter edit form
        - there is also a search box on the menue for searching chapter names, and a delete button next to each chapter.

## Development Guide

Before you start you should make sure you have installed the following things on your computer:

1. Node.js ^20 and npm: https://nodejs.org/en/download/
2. PostgreSQL 17: https://www.postgresql.org/download/

You should also make sure you have the following accounts ready, and have the secrets/keys required on hand.

1. Digital Ocean: Go to (https://cloud.digitalocean.com) and apply for a Spaces Object Storage

    On Spaces > Access Keys, you should be able to create an access key with full access.

```bash
SPACES_KEY=                                          #Access Key ID
SPACES_SECRET=                                       #Secret Key generated by 'create access key'
SPACES_REGION=nyc3                                   #the region, choose the one closest to you or the end user
SPACES_BUCKET=world-is-a-library-files               #the name of your space bucket
SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com  #the endpoint, repalce nyc3 if you are using a diffrent region
```

2. Resend: https://resend.com/ (Required in Production)

    You will need a domain to generate API key with Resend. This environment variable has been set as a secrete on deployment platform. On development, you can just remove `RESEND_API_KEY` to turn of email verification

```bash
RESEND_API_KEY=                                                                      #The api key to send email from your domain
SENDER_EMAIL="World-Is-a-Library <donotreply@notifications.world-is-a-library.com>"  #an email address under your domain
```

3. Better Auth: https://www.better-auth.com/

    You can generate a secret with the `Generate Secret` button on https://www.better-auth.com/docs/installation, or use your own nounce

```bash
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000  #the base url of your app
NEXT_AUTH_COOKIE_DOMAIN=http://localhost:3000  #the base url of your server
```

4. Postgres Database

After installing PostgreSQL and starting PostgreSQL server, set the enviroments variables accoring to .env.example

```bash
DATABASE_URL="postgresql://username:password@host:port/defaultdb"
# replace username and password with your postgresql username and password
# on dev, host = localhost
#          port = 3000
```

By far, the `.env` file should have the following attributes. (check .env.example)

```bash
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:password@localhost:3000/defaultdb"
RESEND_API_KEY= #(optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
SENDER_EMAIL="World-Is-a-Library <donotreply@notifications.world-is-a-library.com>"
SPACES_KEY=
SPACES_SECRET=
SPACES_REGION=nyc3
SPACES_BUCKET=world-is-a-library-files
SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
COOKIE_DOMAIN=http://localhost:3000
```

### Environment setup and configuration

1. Clone this repo:

```bash
git clone https://github.com/shang8024/world-is-a-library-app.git
```

2. At root, install dependencies

```bash
npm install
```

### Database initialization

On first time, run

```bash
npx prisma migrate dev --name init
```

To reset (drops and recreate) the database:

```bash
npx prisma migrate reset --force
```

### Cloud storage configuration

The book coverage images (implemented) and user profile avatars (plan) should be stored in Digital Ocean Space bucket.

Check `Development Guide` section for details.

### Local development and testing

To start a dev server, run

```bash
npm install
npm run dev
```

This will start a Nextjs full stack app at localhost:3000.

For testing, this project is currently using manual UI testing. But everyone is welcomed to put the tests in `/src/test` folder.

To test the app, run

```bash
npm test
```

## Deployment Information

Live URL: https://world-is-a-library-app.vercel.app/.

The postgres database is deployed on Digital ocean and the nextjs app is deployed with Vercel (vercel.com).

On deployment, you need to change the following .env variables:

```bash
DATABASE_URL=                          #The Connection string you get from Digital ocean > databse > connection details
BETTER_AUTH_URL=                       #your deployed domain, in this case, https://world-is-a-library-app.vercel.app/
NEXT_PUBLIC_APP_URL=                   #your deployed domain, ...
COOKIE_DOMAIN=                         #your deployed domain,...
```

## Individual Contributions

As this is a one-person team, the sole member did everything including:

- design database schema
- design and implement frontend layouts, pages, compoennts
- design and implement hooks and routing
- design and implement client apis and serevr actions
- build and deploy

## Lessons Learned and Concluding Remarks

Reflecting on the development journey of this project, several key insights and lessons have emerged:​

- Importance of Early Planning and Time Management

    One of the foremost lessons is the critical importance of initiating the project earlier. Delaying the start compressed the development timeline, leading to increased pressure during the final stages. Allocating more time upfront would have allowed for a more measured approach to development, testing, and refinement.​

- Deployment Challenges

    Deploying the application presented its own set of challenges, particularly when integrating services like Vercel and DigitalOcean. Issues arose in configuring domain and secure settings and ensuring seamless communication between platforms. For instance, at the first feel failed deployment, the issues came freom not setting CORS correctly while I am using a domain (client) redirct to a diffrent domain (server).​ Even after I set the cors, the issue with Better-auth cookies still block me til now. Another thing is that, since digital ocean isnt in the market place of Vercel and Vercel do not provide a static IPv4 address, I have to finnal set my digital Ocean database to accept connection from all place (and have to change secrete regularly). This taught me that I should do more research before choosing a deploy platform.

- Compatibility Issues with Modern Tooling

    The integration of cutting-edge technologies like React 19, Tailwind CSS v4, and Shadcn UI introduced compatibility hurdles. Notably, certain components from Shadcn UI required updates to function correctly with the latest versions of React and Tailwind CSS. Resolving these issues demanded a deep dive into documentation and community forums to implement effective solutions.​ Though using shadcn@canary (experimental Tailwind v4 components) instead of shadcn@latest, I still have to manually make adjustment to /components/ui and have to upload those to github repo.

In conclusion, this project has been a valuable learning experience, highlighting the significance of proactive planning, the intricacies of deployment across different platforms, and the challenges of integrating modern development tools. These lessons will undoubtedly inform and enhance future development endeavors.