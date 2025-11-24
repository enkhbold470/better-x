export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
}

export interface Tweet {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  likes: number;
  reposts: number;
  replies: number;
  likedBy: Set<string>;
  repostedBy: Set<string>;
}

export interface Follow {
  followerId: string;
  followingId: string;
}

class MockDataStore {
  private users: Map<string, User> = new Map();
  private tweets: Map<string, Tweet> = new Map();
  private follows: Map<string, Set<string>> = new Map(); // userId -> Set of following user IDs
  private currentUserId: string = "user1";

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock users
    const mockUsers: User[] = [
      {
        id: "user1",
        username: "johndoe",
        displayName: "John Doe",
        avatar: "https://placekeanu.com/500",
        bio: "Software engineer and tech enthusiast",
        followers: 1200,
        following: 450,
      },
      {
        id: "user2",
        username: "janedoe",
        displayName: "Jane Doe",
        avatar: "https://placekeanu.com/500",
        bio: "Designer & creator",
        followers: 3400,
        following: 890,
      },
      {
        id: "user3",
        username: "techguru",
        displayName: "Tech Guru",
        avatar: "https://placekeanu.com/500",
        bio: "Sharing the latest in tech",
        followers: 15600,
        following: 120,
      },
      {
        id: "user4",
        username: "devmaster",
        displayName: "Dev Master",
        avatar: "https://placekeanu.com/500",
        bio: "Building the future, one commit at a time",
        followers: 8900,
        following: 230,
      },
    ];

    mockUsers.forEach((user) => {
      this.users.set(user.id, user);
      this.follows.set(user.id, new Set());
    });

    // Create mock tweets
    const mockTweets: Omit<Tweet, "likedBy" | "repostedBy">[] = [
      {
        id: "tweet1",
        userId: "user2",
        content: "Just launched a new design system! Excited to see what the community builds with it. 🎨",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        likes: 45,
        reposts: 12,
        replies: 8,
      },
      {
        id: "tweet2",
        userId: "user3",
        content: "The future of web development is looking bright. React Server Components are game-changing! 🚀",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        likes: 234,
        reposts: 67,
        replies: 23,
      },
      {
        id: "tweet3",
        userId: "user4",
        content: "Spent the weekend building a microservices architecture. The complexity is real, but the scalability is worth it.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        likes: 89,
        reposts: 34,
        replies: 15,
      },
      {
        id: "tweet4",
        userId: "user1",
        content: "Working on a new Next.js project. The App Router is fantastic!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        likes: 12,
        reposts: 3,
        replies: 5,
      },
      {
        id: "tweet5",
        userId: "user2",
        content: "Design tip: Always consider accessibility first. Your users will thank you! ♿️",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        likes: 156,
        reposts: 45,
        replies: 28,
      },
    ];

    mockTweets.forEach((tweet) => {
      this.tweets.set(tweet.id, {
        ...tweet,
        likedBy: new Set(),
        repostedBy: new Set(),
      });
    });

    // Set up some follows
    this.follows.get("user1")?.add("user2");
    this.follows.get("user1")?.add("user3");
    this.follows.get("user2")?.add("user3");
    this.follows.get("user3")?.add("user4");
  }

  getCurrentUser(): User {
    return this.users.get(this.currentUserId)!;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getTweets(): Tweet[] {
    return Array.from(this.tweets.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  getTweetsForUser(userId: string): Tweet[] {
    return Array.from(this.tweets.values())
      .filter((tweet) => tweet.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getTimelineTweets(): Tweet[] {
    const following = this.follows.get(this.currentUserId) || new Set();
    const followingArray = Array.from(following);
    
    return Array.from(this.tweets.values())
      .filter((tweet) => followingArray.includes(tweet.userId) || tweet.userId === this.currentUserId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  createTweet(content: string): Tweet {
    const tweet: Tweet = {
      id: `tweet${Date.now()}`,
      userId: this.currentUserId,
      content,
      createdAt: new Date(),
      likes: 0,
      reposts: 0,
      replies: 0,
      likedBy: new Set(),
      repostedBy: new Set(),
    };
    this.tweets.set(tweet.id, tweet);
    return tweet;
  }

  toggleLike(tweetId: string): { liked: boolean; likes: number } {
    const tweet = this.tweets.get(tweetId);
    if (!tweet) {
      throw new Error("Tweet not found");
    }

    const isLiked = tweet.likedBy.has(this.currentUserId);
    if (isLiked) {
      tweet.likedBy.delete(this.currentUserId);
      tweet.likes--;
    } else {
      tweet.likedBy.add(this.currentUserId);
      tweet.likes++;
    }

    return { liked: !isLiked, likes: tweet.likes };
  }

  toggleRepost(tweetId: string): { reposted: boolean; reposts: number } {
    const tweet = this.tweets.get(tweetId);
    if (!tweet) {
      throw new Error("Tweet not found");
    }

    const isReposted = tweet.repostedBy.has(this.currentUserId);
    if (isReposted) {
      tweet.repostedBy.delete(this.currentUserId);
      tweet.reposts--;
    } else {
      tweet.repostedBy.add(this.currentUserId);
      tweet.reposts++;
    }

    return { reposted: !isReposted, reposts: tweet.reposts };
  }

  toggleFollow(userId: string): { following: boolean } {
    if (userId === this.currentUserId) {
      return { following: false };
    }

    const currentUserFollows = this.follows.get(this.currentUserId) || new Set();
    const isFollowing = currentUserFollows.has(userId);

    if (isFollowing) {
      currentUserFollows.delete(userId);
      const user = this.users.get(userId);
      if (user) user.followers--;
      const currentUser = this.users.get(this.currentUserId);
      if (currentUser) currentUser.following--;
    } else {
      currentUserFollows.add(userId);
      const user = this.users.get(userId);
      if (user) user.followers++;
      const currentUser = this.users.get(this.currentUserId);
      if (currentUser) currentUser.following++;
    }

    this.follows.set(this.currentUserId, currentUserFollows);
    return { following: !isFollowing };
  }

  isFollowing(userId: string): boolean {
    const currentUserFollows = this.follows.get(this.currentUserId) || new Set();
    return currentUserFollows.has(userId);
  }

  isLiked(tweetId: string): boolean {
    const tweet = this.tweets.get(tweetId);
    return tweet?.likedBy.has(this.currentUserId) || false;
  }

  isReposted(tweetId: string): boolean {
    const tweet = this.tweets.get(tweetId);
    return tweet?.repostedBy.has(this.currentUserId) || false;
  }
}

export const mockDataStore = new MockDataStore();

