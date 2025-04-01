# Project Proposal - a Fanfiction community with Danmaku

## Motivation

The lack of timely feedback and interaction often leads to a loss of interest in serialized works among both new authors and their readers. This issue is particularly prevalent in smaller, geographically dispersed fandom communities. New authors may struggle to maintain motivation without immediate engagement, while readers may feel disconnected from the narrative and the community. This disconnect can result in abandoned works and a dwindling readership, ultimately stifling creativity and community growth.

Our project addresses this critical need by introducing a fan-centric community platform, akin to [Lofter](http://www.lofter.com) and [Archive of Our Own](http://archiveofourown.org), but specifically tailored for fictions, with a unique floating segment comment (danmaku) feature. This feature allows readers to leave concise, asynchronous comments on specific segments of a text, fostering a dynamic and interactive reading experience. Unlike traditional chapter comments, which may intimidate new readers from engaging with older inactive content (often referred to as "Necrobumping"), segment comments provide a low-barrier entry point for readers to express their thoughts and reactions in real-time as they read. This not only enhances reader engagement but also provides authors with valuable feedback on their work.

The target users for this platform are primarily new and emerging authors within niche fanfiction communities, as well as their readers. These users often face challenges in building a dedicated readership due to the lack of interactive tools that facilitate community engagement. By providing a space where readers can easily interact with the text and each other, we aim to create a more vibrant and supportive environment that encourages both the creation and consumption of serialized fiction.

Existing solutions, such as traditional comment sections or forums, often fall short in addressing the need for real-time, segment-specific interaction. These platforms typically require readers to navigate away from the text to engage in discussions, disrupting the reading experience. Additionally, the fear of "Necrobumping" can deter readers from commenting on older chapters, further limiting interaction. Our segment comment feature directly addresses these limitations by embedding interactive elements within the text itself, allowing for seamless and contextually relevant engagement.

In conclusion, this project is worth pursuing because it not only addresses a significant gap in the current landscape of fan fiction communities but also enhances the overall experience for both authors and readers. By fostering a more interactive and supportive environment, we aim to revitalize interest in serialized fiction and empower new authors to thrive in their creative endeavors.

## Objective and Key Features

The primary objective of this project is to create a fan-centric community platform tailored for fiction enthusiasts, with a focus on fostering engagement between authors and readers through innovative features like segment comments. The web app should have basic functionality for authors to create fiction works and edit chapters, and for readers to search, tag, view and comment. 

### Technical implementation approach

- **Full stack**: Next.js for its SSR/SSG capabilities, ensuring fast load times.
- **UI**: shadcn/ui as component libraries and Tailwind CSS for styling
- **Database**: PostgreSQL for relational data (users, stories, comments, tags) with Prisma ORM for schema management. The relational database will only store meta data of stories (word counts, updated dates,  comment summaries, etc.)
- **File Storage**: Cloud storage (AWS S3) to store stories and other assets (profile pictures, illustrations, etc.).
- **External APIs**:
    - EmailJS for email authentication and notifications for mentions and replies
    - Stripe Connect for membership system payments (optional)
    - [Socket.IO](http://Socket.IO) for realtime danmakus (optional)

### Database schema and relationships

```markdown
model User {
  id              Int       @id @default(autoincrement())
  email           String    @unique
  passwordHash    String
  role            Role      @default(READER)
  profilePicture  String?
  bio             String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relationships
  stories         Story[]   // Stories authored by the user
  comments        Comment[] // Comments made by the user
  notifications   Notification[] // Notifications received by the user
  subscriptions   Subscription[] // Subscriptions (if the user is an author)
  followers       Follower[]     // Users who follow this user
  following       Follower[]     // Users this user is following

  // Indexes
  @@index([email])
}

// Stories Table
model Story {
  id              Int       @id @default(autoincrement())
  title           String
  description     String?
  coverImage      String?   // url to image in cloud storage
  authorId        Int
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relationships
  author          User      @relation(fields: [authorId], references: [id])
  chapters        Chapter[] // Chapters in the story
  tags            Tag[]     // Tags associated with the story
  comments        Comment[] // Comments on the story
  likes           Like[]    // Likes on the story

  // Indexes
  @@index([title])
  @@index([authorId])
}

model Chapter {
  id              Int       @id @default(autoincrement())
  title           String
  content         String    // URL to the chapter content stored in cloud storage
  storyId         Int
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relationships
  story           Story     @relation(fields: [storyId], references: [id])
  segments        Segment[] // Segments in the chapter
  comments        Comment[] // Comments on the chapter

  // Indexes
  @@index([storyId])
}

model Segment {
  id              Int       @id @default(autoincrement())
  content         String    // URL to the segment content stored in cloud storage
  startIndex      Int       // Position of the segment in the chapter
  chapterId       Int
  createdAt       DateTime  @default(now())

  // Relationships
  chapter         Chapter   @relation(fields: [chapterId], references: [id])
  comments        Comment[] // Comments on the segment

  // Indexes
  @@index([chapterId])
}

model Comment {
  id              Int       @id @default(autoincrement())
  content         String
  userId          Int
  segmentId       Int?
  parentCommentId Int?      // For child comments
  createdAt       DateTime  @default(now())

  // Relationships
  user            User      @relation(fields: [userId], references: [id])
  segment         Segment?  @relation(fields: [segmentId], references: [id])
  parentComment   Comment?  @relation("CommentReplies", fields: [parentCommentId], references: [id])
  replies         Comment[] @relation("CommentReplies")
  likes           Like[]    // Likes on the comment

  // Indexes
  @@index([userId])
  @@index([segmentId])
}

model Like {
  id              Int       @id @default(autoincrement())
  userId          Int
  storyId         Int?
  commentId       Int?
  createdAt       DateTime  @default(now())

  // Relationships
  user            User      @relation(fields: [userId], references: [id])
  story           Story?    @relation(fields: [storyId], references: [id])
  comment         Comment?  @relation(fields: [commentId], references: [id])

  // Indexes
  @@index([userId])
  @@index([storyId])
  @@index([commentId])
}

model Tag {
  id              Int       @id @default(autoincrement())
  name            String
  storyId         Int

  // Relationships
  story           Story     @relation(fields: [storyId], references: [id])

  // Indexes
  @@index([name])
  @@index([storyId])
}

model Notification {
  id              Int       @id @default(autoincrement())
  userId          Int
  message         String
  isRead          Boolean   @default(false)
  createdAt       DateTime  @default(now())

  // Relationships
  user            User      @relation(fields: [userId], references: [id])

  // Indexes
  @@index([userId])
}

model Subscription {
  id              Int       @id @default(autoincrement())
  authorId        Int       // The author being subscribed to
  subscriberId    Int       // The user subscribing
  tier            String    // Subscription tier (e.g., basic, premium)
  createdAt       DateTime  @default(now())

  // Relationships
  author          User      @relation("AuthorSubscriptions", fields: [authorId], references: [id])
  subscriber      User      @relation("SubscriberSubscriptions", fields: [subscriberId], references: [id])

  // Indexes
  @@index([authorId])
  @@index([subscriberId])
}

model Follower {
  id              Int       @id @default(autoincrement())
  followerId      Int       // The user who is following
  followingId     Int       // The user being followed
  createdAt       DateTime  @default(now())

  // Relationships
  follower        User      @relation("Follower", fields: [followerId], references: [id])
  following       User      @relation("Following", fields: [followingId], references: [id])

  // Indexes
  @@index([followerId])
  @@index([followingId])
}

// Enum for User Roles
enum Role {
  READER
  AUTHOR
}
```

### File storage requirements

Images: Profile pictures, story cover art, stories and other media will be stored in cloud storage (AWS S3 or Cloudinary).

Text Content: Stories with be stored in cloud storage, while the metadata and comment text will be stored in the database for efficient querying.

### User Interface and experience design

### Key Feactures

The following features/functionalities will fulfill the course requirements with responsive UI design and will implement at least three advanced features (User authentication and authorization, File handling and processing, API integration with external services).

---

**High priority:**

- User authentication with different roles (Author, Student)
    - Role Based Access Controls with React Contexts
    - Since the email will serve as the uique user ID, sending an email authentication code will be part of the authentication process.
- Stories and chapters management (for authors)
    - technique like version control system will be appiled when an author is editing a chapter already have comments and is breaking current segments.
- User functionalities and dashboard
    - Users should be able to view, search, like, unlinke an story/chapter, or follow an author to get notifided when there is a new chapter.
    - Users should be able to see the replies, likes, mentions, in their dashboard.
    - Users are able to edite their profiles, password and other information.
- Comment system
    - when loading a chapter, the api will first fetch a comment summury showing how many comments are after a specific segment. The user should see a notation with that number after each segment.
        
        ```jsx
        {...,[
        	{
        		"segmentId": Int,
        		"CommentNum": Int,
        	},
        ]}
        ```
        
    - After clicked on that segment, the comments should be displayed both as floating danmaku over the texts, and a foldable list of segment comments
    - Users can thums up or down comments. Users should be able to leave a child comment (comment of a comment). Deleting a comment will not delete the child comments.
    - The danmakus can be either asynchronous (primary plan) fetched from server and update with advanced state management or in real-time with [Socket.IO](http://socket.io/) (if time allows).

---

**Mid priority:**

- Membership system
    - Allowing authors to set different tiers of followers. Add up to current role based access control system.
    - Integrate with Stripe AI for payments
    - Subscription history should be record in user profiles.
- Email notification for mentions and replies
    - Like Piazza’s solution, a email containing updates will be sent in a daily manner.
    - Users (both authors and readers) can toggle the notifications in the profile page.

---

**Low priority:**

- Realtime Danmaku
    - In the primary plan, danmakus are asynchronous, fetched from server and update with advanced state management. If time allows, a real-time solution with [Socket.IO](http://socket.io/) can be parallelly applied**.**
- Allow comments and chapters to support other kind of media
- Customizable theme for reading (light/dark mode, font size, etc.)

### Project Scope and Feasibility

The project is ambitious but achievable within the timeframe by prioritizing core features (segment comments, user profiles, story management) and deferring advanced features to future iterations. 

By focusing on the MVP and leveraging existing knowledge, tools and libraries, the project is feasible within the given timeframe.

To save time on non-development tasks, in this project, the textual content on the platform (e.g., stories, comments) will be generated by DeepSeek R1. This approach allows us to focus on building and showcasing the core functionality of the platform while ensuring a rich and engaging user experience.

## **Tentative Plan**

Since this is a one-person team, there is certain flexibility in task scheduleing and how things work. Even so, the implementation process of each task/subtask still follows the following order:

- Plan: Open GitHub issues with user stories and acceptance criteria.
- Design: Create architecture diagrams, set up code structures, write TODO comments.
- Test: Write unit, integration, and E2E tests before implementation.
- Implement: Build features, refactor code, and test.
- Document: Update API documentation and other documentations if any thing changes.

For a rough schedule,

3.17-3.18: dev env, databasse, cloud storage,  test infrastructure, & production Setup

- Set up the Next.js project with a basic folder structure.
- Connect the project to a PostgreSQL database using Prisma ORM.
- Set up cloud storage (e.g., AWS S3 or Cloudinary) for handling media files.
- Write a bootstrap script to run the app in development mode.
- Set up a test infrastructure and a CI System with Github Action
- deploy the web app to a production environment
- Open GitHub issues for **user stories** and **acceptance criteria** for high-priority features.

3.19-23: Frontend framework, routes, and user authentication

- create page and component templates for:
    - Profile page
    - Home page
    - Notification panel
    - Author information page
    - Story page
    - Chapter page
    - Comment list
    - SignIn/Signup
- Email based user authentication
    - Implement email-based authentication with verification codes.
    - Use NextAuth.js or a custom solution for handling authentication.
    - Set up React Context for managing user roles (Author, Reader) and role-based access control (e.g., Authors can create stories, Readers can only comment).

3.24-3.30: Story and Chapter Management

- Implement story creation and chapter upload functionality.
- Use a version control-like system to handle edits to chapters with existing comments.
- Implement search functionality for stories and chapters.
- Add like/unlike and follow author functionality.

3.31-4.9: Comment System

4.10-4.13: User dashboard

4.14-17: Implement mid-priority features. While the mid-priority features are add up to existing features with external apis, the implementation should not take too long.

4.18-4.19: UI enhancement and consider implementing low priority features.

4.20: Final report and vedio demo