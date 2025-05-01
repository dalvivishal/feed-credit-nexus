
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Content = require('./models/contentModel');
const Transaction = require('./models/transactionModel');
const Report = require('./models/reportModel');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Sample content data
const contentData = [
  {
    title: "Getting Started with React Hooks",
    description: "Learn how to use React Hooks to simplify your functional components and manage state efficiently.",
    contentType: "article",
    source: "React Documentation",
    imageUrl: "https://random.imagecdn.app/800/400",
    contentUrl: "https://reactjs.org/docs/hooks-intro.html",
    tags: ["react", "javascript", "frontend"],
    difficulty: "beginner"
  },
  {
    title: "Advanced TypeScript Techniques",
    description: "Explore advanced features of TypeScript that can improve your code quality and developer experience.",
    contentType: "video",
    source: "TypeScript Conference",
    imageUrl: "https://random.imagecdn.app/800/401",
    contentUrl: "https://www.typescriptlang.org/docs/",
    tags: ["typescript", "javascript", "frontend"],
    difficulty: "advanced"
  },
  {
    title: "Introduction to Node.js",
    description: "Learn the basics of Node.js and how to build server-side applications with JavaScript.",
    contentType: "course",
    source: "Node.js Foundation",
    imageUrl: "https://random.imagecdn.app/800/402",
    contentUrl: "https://nodejs.org/en/learn",
    tags: ["nodejs", "javascript", "backend"],
    difficulty: "beginner"
  },
  {
    title: "MongoDB for JavaScript Developers",
    description: "Learn how to use MongoDB with Node.js to build scalable and flexible database-driven applications.",
    contentType: "course",
    source: "MongoDB University",
    imageUrl: "https://random.imagecdn.app/800/403",
    contentUrl: "https://university.mongodb.com",
    tags: ["mongodb", "database", "backend"],
    difficulty: "intermediate"
  },
  {
    title: "Building REST APIs with Express",
    description: "A comprehensive guide to building RESTful APIs using Express.js and Node.js.",
    contentType: "article",
    source: "Express Documentation",
    imageUrl: "https://random.imagecdn.app/800/404",
    contentUrl: "https://expressjs.com/en/guide/routing.html",
    tags: ["express", "nodejs", "api"],
    difficulty: "intermediate"
  },
  {
    title: "React Native Fundamentals",
    description: "Learn how to build mobile applications for iOS and Android using React Native.",
    contentType: "video",
    source: "React Native Community",
    imageUrl: "https://random.imagecdn.app/800/405",
    contentUrl: "https://reactnative.dev/docs/getting-started",
    tags: ["react-native", "mobile", "javascript"],
    difficulty: "intermediate"
  },
  {
    title: "GraphQL vs REST: Pros and Cons",
    description: "A detailed comparison of GraphQL and REST API architectures with practical examples.",
    contentType: "article",
    source: "Apollo Blog",
    imageUrl: "https://random.imagecdn.app/800/406",
    contentUrl: "https://www.apollographql.com/blog/graphql/basics/graphql-vs-rest/",
    tags: ["graphql", "rest", "api"],
    difficulty: "advanced"
  },
  {
    title: "CSS Grid Layout Mastery",
    description: "Master CSS Grid Layout to create complex responsive layouts with ease.",
    contentType: "resource",
    source: "CSS-Tricks",
    imageUrl: "https://random.imagecdn.app/800/407",
    contentUrl: "https://css-tricks.com/snippets/css/complete-guide-grid/",
    tags: ["css", "frontend", "responsive"],
    difficulty: "intermediate"
  }
];

// Import Data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Content.deleteMany();
    await Transaction.deleteMany();
    await Report.deleteMany();

    console.log('Data cleared...');

    // Create users
    const adminPassword = await bcrypt.hash('admin123', 12);
    const moderatorPassword = await bcrypt.hash('moderator123', 12);
    const userPassword = await bcrypt.hash('user123', 12);

    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      credits: 1000,
      avatar: 'https://i.pravatar.cc/150?img=1'
    });

    const moderator = await User.create({
      username: 'jane',
      email: 'jane@example.com',
      password: moderatorPassword,
      role: 'moderator',
      credits: 500,
      avatar: 'https://i.pravatar.cc/150?img=2'
    });

    const user = await User.create({
      username: 'john',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
      credits: 250,
      avatar: 'https://i.pravatar.cc/150?img=3'
    });

    console.log('Users created...');

    // Create content
    const createdContent = await Promise.all(
      contentData.map(async (content, index) => {
        // Alternate between users
        const creator = index % 3 === 0 ? admin._id :
                        index % 3 === 1 ? moderator._id : user._id;

        return await Content.create({
          ...content,
          createdBy: creator
        });
      })
    );

    console.log('Content created...');

    // Create some transactions
    const transactions = [
      {
        user: user._id,
        amount: 100,
        type: 'credit',
        description: 'Initial credit bonus',
        reference: 'admin_adjustment'
      },
      {
        user: user._id,
        amount: 25,
        type: 'credit',
        description: 'Daily login bonus',
        reference: 'daily_login'
      },
      {
        user: user._id,
        amount: 5,
        type: 'credit',
        description: 'Saved content',
        reference: 'content_save',
        contentId: createdContent[0]._id
      },
      {
        user: user._id,
        amount: 10,
        type: 'debit',
        description: 'Used credits for premium feature',
        reference: 'premium_feature'
      },
      {
        user: moderator._id,
        amount: 200,
        type: 'credit',
        description: 'Moderator bonus',
        reference: 'admin_adjustment'
      }
    ];

    await Transaction.create(transactions);
    console.log('Transactions created...');

    // Save some content for users
    const firstContent = await Content.findById(createdContent[0]._id);
    firstContent.savedBy.push(user._id);
    await firstContent.save();

    const secondContent = await Content.findById(createdContent[1]._id);
    secondContent.savedBy.push(user._id);
    secondContent.savedBy.push(moderator._id);
    await secondContent.save();

    // Create a report
    await Report.create({
      contentId: createdContent[2]._id,
      userId: user._id,
      reportType: 'misinformation',
      description: 'This content contains incorrect information about Node.js versions',
      status: 'pending'
    });

    console.log('Reports created...');

    console.log('Data Import Success');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Content.deleteMany();
    await Transaction.deleteMany();
    await Report.deleteMany();

    console.log('Data Destroyed');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
